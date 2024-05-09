import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { Kysely, sql } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';
import { Order } from '../orders/entities/order.model';
import { OrderStatus } from '../types';
import { BoxRepository } from './box.repository';

@Injectable()
export class OrderRepository {
  constructor(
    @Inject(ClientName) private readonly client: Kysely<DB>,
    private readonly boxRepository: BoxRepository,
  ) {
  }

  async createOrder(order: Order) {
    return this.client.transaction()
      .execute(async (trx) => {
        const { id } = await trx.insertInto('orders')
          .values({
            user_id: order.user_id,
            box_num: order.box_num,
            start_at: order.start_at,
            status: OrderStatus.CREATED,
          })
          .returning('id')
          .executeTakeFirst();

        await trx.insertInto('orders_packages')
          .values({
            order_id: id,
            package_ids: order.packages,
            total_price: order.total_price,
            total_time: order.total_time,
          })
          .execute();

        await trx.insertInto('boxes_queue')
          .values({ box_num: order.box_num, curr_queue: 1 })
          .onConflict(b => {
            return b.column('box_num')
              .doUpdateSet(eb => ({
                curr_queue: eb('boxes_queue.curr_queue', '+', 1),
              }));
          })
          .execute();

        return id;
      });
  };

  getOrderStatus(id: number) {
    return this.client
      .selectFrom('orders')
      .select('status')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  cancelOrder(id: number) {
    return this.client.transaction()
      .execute(async (trx) => {
        const boxNumRes = await trx.selectFrom('orders')
          .where('id', '=', id)
          .where('status', '!=', OrderStatus.CANCELLED)
          .select('box_num')
          .executeTakeFirst();

        await trx.updateTable('orders')
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
    return this.client.transaction()
      .execute(async (trx) => {
        const boxNumRes = await trx.selectFrom('orders')
          .where('id', '=', id)
          .where('status', '!=', OrderStatus.COMPLETED)
          .select('box_num')
          .executeTakeFirst();

        await trx.updateTable('orders')
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
    return this.client.selectFrom('orders')
      .innerJoin('orders_packages', 'orders.id', 'orders_packages.order_id')
      .selectAll()
      .where('orders.user_id', '=', userId)
      .execute();
  }

  countOrdersByBoxNum(box_num: number) {
    return this.client.selectFrom('orders').where('box_num', '=', box_num)
      .where('status', 'in', [OrderStatus.IN_PROGRESS, OrderStatus.CREATED])
      .select(sql<number>`count(1)`.as('queue'))
      .executeTakeFirst();
  }
}