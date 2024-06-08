import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { Kysely, sql } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';
import {
  CreatePackageDto,
  UpdatePackageDto,
} from '../packages/entities/packages.dto';

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

  getPackagesByIds(ids: number[]) {
    return this.client
      .selectFrom('packages')
      .selectAll()
      .where('id', 'in', ids)
      .orderBy('id', 'asc')
      .execute();
  }

  getPackages() {
    return this.client
      .selectFrom('packages')
      .selectAll()
      .orderBy('id', 'asc')
      .execute();
  }

  updatePackage(id: number, updatee: UpdatePackageDto) {
    return this.client
      .updateTable('packages')
      .set(updatee)
      .where('id', '=', id)
      .returning('id')
      .execute();
  }

  addNewPackage(body: CreatePackageDto) {
    return this.client
      .insertInto('packages')
      .values(body)
      .returning('id')
      .execute();
  }

  deletePackage(id: number) {
    return this.client
      .updateTable('packages')
      .set('deleted', true)
      .where('id', '=', id)
      .returning('id')
      .execute();
  }

  getCreatePackages() {
    return this.client
      .selectFrom('packages')
      .selectAll()
      .where('deleted', 'is', null)
      .execute();
  }
}
