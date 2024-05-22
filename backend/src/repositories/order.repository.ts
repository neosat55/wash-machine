import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { Kysely, sql } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';
import { Order } from '../orders/entities/order.model';
import { OrderStatus } from '../types';
import { BoxRepository } from './box.repository';
import { LoadAllDto } from '../orders/entities/orders.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(ClientName) private readonly client: Kysely<DB>,
    private readonly boxRepository: BoxRepository,
  ) {}

  async createOrder(order: Order) {
    return this.client.transaction().execute(async (trx) => {
      const { id } = await trx
        .insertInto('orders')
        .values({
          user_id: order.user_id,
          box_num: order.box_num,
          start_at: order.start_at,
          status: OrderStatus.CREATED,
        })
        .returning('id')
        .executeTakeFirst();

      await trx
        .insertInto('orders_packages')
        .values({
          order_id: id,
          package_ids: order.packages,
          total_price: order.total_price,
          total_time: order.total_time,
        })
        .execute();

      await trx
        .insertInto('boxes_queue')
        .values({ box_num: order.box_num, curr_queue: 1 })
        .onConflict((b) => {
          return b.column('box_num').doUpdateSet((eb) => ({
            curr_queue: eb('boxes_queue.curr_queue', '+', 1),
          }));
        })
        .execute();

      return id;
    });
  }

  getOrderStatus(id: number) {
    return this.client
      .selectFrom('orders')
      .select('status')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  cancelOrder(id: number) {
    return this.client.transaction().execute(async (trx) => {
      const boxNumRes = await trx
        .selectFrom('orders')
        .where('id', '=', id)
        .where('status', '!=', OrderStatus.CANCELLED)
        .select('box_num')
        .executeTakeFirst();

      await trx
        .updateTable('orders')
        .set({ status: OrderStatus.CANCELLED })
        .where('id', '=', id)
        .execute();

      if (boxNumRes) {
        await this.boxRepository.useTrx(trx).decreaseQueue(boxNumRes.box_num);
      }

      return true;
    });
  }

  completeOrder(id: number) {
    return this.client.transaction().execute(async (trx) => {
      const boxNumRes = await trx
        .selectFrom('orders')
        .where('id', '=', id)
        .where('status', '!=', OrderStatus.COMPLETED)
        .select('box_num')
        .executeTakeFirst();

      await trx
        .updateTable('orders')
        .set({ status: OrderStatus.COMPLETED })
        .where('id', '=', id)
        .execute();

      if (boxNumRes) {
        await this.boxRepository.useTrx(trx).decreaseQueue(boxNumRes.box_num);
      }

      return true;
    });
  }

  getOrdersHistory(userId: number) {
    return this.client
      .selectFrom('orders')
      .innerJoin('orders_packages', 'orders.id', 'orders_packages.order_id')
      .selectAll()
      .where('orders.user_id', '=', userId)
      .execute();
  }

  getCurrentOrders(userId: number) {
    return this.client
      .selectFrom('orders')
      .innerJoin('orders_packages', 'orders.id', 'orders_packages.order_id')
      .selectAll()
      .where('orders.user_id', '=', userId)
      .where('status', 'not in', [OrderStatus.COMPLETED])
      .execute();
  }

  getBoxesQueueForCurrentDay() {
    return (
      this.client
        .selectFrom('orders')
        .where('status', 'in', [OrderStatus.IN_PROGRESS, OrderStatus.CREATED])
        // .where('start_at', '>=', new Date())
        // .where('start_at', '<=', new Date())
        .select(sql<number>`count(1)`.as('queue'))
        .executeTakeFirst()
    );
  }

  loadAllInProgress() {
    return this.client
      .selectFrom('orders')
      .innerJoin('orders_packages', 'orders.id', 'orders_packages.order_id')
      .select([
        'orders_packages.package_ids',
        'orders_packages.total_price',
        'orders_packages.total_time',
      ])
      .selectAll('orders')
      .where('orders.status', 'not in', [
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
      ])
      .orderBy('start_at', 'asc')
      .execute();
  }

  async changeOrderStatus(id: number, orderStatus: OrderStatus) {
    await this.client
      .updateTable('orders')
      .set({ status: orderStatus })
      .where('id', '=', id)
      .execute();

    return true;
  }

  loadAll(body: LoadAllDto) {
    let query = this.client
      .selectFrom('orders')
      .innerJoin('orders_packages', 'orders.id', 'orders_packages.order_id')
      .select([
        'orders_packages.package_ids',
        'orders_packages.total_price',
        'orders_packages.total_time',
      ])
      .selectAll('orders')
      .orderBy('start_at', 'asc');

    if (body.filters?.status?.length) {
      query = query.where('status', 'in', body.filters.status);
    }

    if (body.filters?.packages?.length) {
      query = query.where(
        'package_ids',
        '@>',
        // @ts-ignore
        sql`ARRAY[${sql.join(body.filters.packages)}]::int[]`,
      );
    }

    return query.execute();
  }

  getUserIdByOrderId(id: number) {
    return this.client
      .selectFrom('orders')
      .where('orders.id', '=', id)
      .select('user_id')
      .executeTakeFirst();
  }
}
