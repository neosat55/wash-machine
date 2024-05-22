import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { Kysely } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';

@Injectable()
export class BonusSystemRepository {
  constructor(@Inject(ClientName) private readonly client: Kysely<DB>) {}

  async addBonusToUser(user_id: number) {
    console.log(user_id);

    await this.client
      .insertInto('bonuses')
      .values({ amount: 10, user_id })
      .onConflict((b) => {
        return b.column('user_id').doUpdateSet((eb) => ({
          amount: eb('bonuses.amount', '+', 10),
        }));
      })
      .execute();
  }

  async getUserBonusesByUserId(userId: number) {
    return this.client
      .selectFrom('bonuses')
      .where('user_id', '=', userId)
      .select('amount')
      .executeTakeFirst();
  }

  async chargeBonuses(userId: number, amount: number) {
    console.log(userId, amount);

    await this.client
      .updateTable('bonuses')
      .set((eb) => ({
        amount: eb('bonuses.amount', '-', amount)
      }))
      .where('user_id', '=', userId)
      .execute();
  }
}
