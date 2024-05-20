import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { Kysely, sql } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';

@Injectable()
export class PackageRepository {
  constructor(@Inject(ClientName) private readonly client: Kysely<DB>) {}

  getPackagesTotalData(
    ids: number[],
  ): Promise<{ total_time: number; total_price: number }> {
    return this.client
      .selectFrom('packages')
      .select([
        sql<number>`sum(duration)`.as('total_time'),
        sql<number>`sum(price)`.as('total_price'),
      ])
      .where('id', 'in', ids)
      .executeTakeFirst();
  }

  getPackages() {
    return this.client.selectFrom('packages').selectAll().execute();
  }
}
