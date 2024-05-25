import { Kysely } from 'kysely';
import { DB } from '../infrastructure/persistence/database/schema/database.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { AddGarageDto, UpdateGarageDto } from '../garage/entities/garage.dto';

@Injectable()
export class GarageRepository {
  constructor(@Inject(ClientName) private readonly connection: Kysely<DB>) {}

  async insertToGarage(user_id: number, garage: AddGarageDto) {
    await this.connection
      .insertInto('garage')
      .values({ user_id, car_number: garage.car_number })
      .execute();
  }

  async updateGarage(id: number, updatee: UpdateGarageDto) {
    await this.connection
      .updateTable('garage')
      .set(updatee)
      .where('id', '=', id)
      .execute();
  }

  async getCars(user_id: number) {
    return this.connection
      .selectFrom('garage')
      .selectAll()
      .where('user_id', '=', user_id)
      .execute();
  }

  deleteCar(id: number) {
    return this.connection
      .deleteFrom('garage')
      .where('id', '=', id)
      .returning('id')
      .execute();
  }
}
