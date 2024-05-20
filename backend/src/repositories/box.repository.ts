import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { Kysely, Transaction } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';
import { BoxModel } from '../boxes/entities/Box.model';
import { UpdateBoxDto } from '../boxes/entities/box.dto';
import { Order } from '../orders/entities/order.model';

@Injectable()
export class BoxRepository {
  constructor(@Inject(ClientName) private readonly client: Kysely<DB>) {}

  useTrx(trx: Transaction<DB>): BoxRepository {
    return new BoxRepository(trx);
  }

  getBoxes() {
    return this.client.selectFrom('boxes').selectAll().execute();
  }

  addNewBox(box: Omit<BoxModel, 'id' | 'masters'>) {
    return this.client
      .insertInto('boxes')
      .values(box)
      .returning('id')
      .executeTakeFirst();
  }

  deleteBox(id: number) {
    return this.client
      .deleteFrom('boxes')
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst();
  }

  getBoxStatus(id: number) {
    return this.client
      .selectFrom('boxes_queue')
      .where('box_num', '=', id)
      .select('status')
      .executeTakeFirst();
  }

  getBoxMasters(id: number) {
    return this.client
      .selectFrom('boxes_masters')
      .where('box_id', '=', id)
      .selectAll()
      .execute();
  }

  getBox(id: number) {
    return this.client
      .selectFrom('boxes')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async increaseQueue(boxId: number, trx: Transaction<DB>) {
    await this.client
      .updateTable('boxes_queue')
      .set((eb) => ({
        curr_queue: eb('boxes_queue.curr_queue', '+', 1),
      }))
      .where('box_num', '=', boxId)
      .execute();
  }

  async decreaseQueue(boxId: number) {
    await this.client
      .updateTable('boxes_queue')
      .set((eb) => ({
        curr_queue: eb('boxes_queue.curr_queue', '-', 1),
      }))
      .where('box_num', '=', boxId)
      .where('curr_queue', '>', 0)
      .execute();
  }

  updateBox(id: number, box: UpdateBoxDto) {
    return this.client
      .updateTable('boxes')
      .where('id', '=', id)
      .set({ name: box.name })
      .returning('id')
      .executeTakeFirst();
  }

  addBoxMaster(box_id: number, master_id: number) {
    return this.client
      .insertInto('boxes_masters')
      .values({ box_id, user_id: master_id })
      .returning('id')
      .executeTakeFirst();
  }

  getBoxQueue(id: number) {
    return this.client
      .selectFrom('boxes_queue')
      .select('curr_queue')
      .where('box_num', '=', id)
      .executeTakeFirst();
  }

  async findBestBox(order: Order) {
    const { id } = await this.client
      .selectFrom('boxes')
      .selectAll()
      .executeTakeFirst();

    return id;
  }
}
