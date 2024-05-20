import { Kysely, sql } from 'kysely';
import { DB, Users } from '../infrastructure/persistence/database/schema/database.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientName } from '../infrastructure/persistence/client.database';
import { GetUsersListDto, UpdateUserDto } from '../users/entities/user.dto';
import { RolesEnum } from '../types';

@Injectable()
export class UserRepository {
  constructor(@Inject(ClientName) private readonly client: Kysely<DB>) {
  }

  async createUser(user: Omit<Users, 'created_at' | 'id' | 'discount'>) {
    const createdAt = new Date();

    const v = await this.client.insertInto('users')
      .values({ ...user, created_at: createdAt })
      .returning('id')
      .executeTakeFirst();

    const role = await this.client.selectFrom('roles')
      .where('name', '=', 'user')
      .select('id')
      .executeTakeFirst();

    await this.client.insertInto('users_roles')
      .values({ user_id: v.id, role_id: role.id })
      .execute();

    return true;
  }

  getUserByEmail(email: string) {
    return this.client.selectFrom('users')
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst();
  }

  getUserByLogin(login: string) {
    return this.client.selectFrom('users')
      .where('username', '=', login)
      .selectAll()
      .executeTakeFirst();
  }

  getUserRoles(userId: number) {
    return this.client.selectFrom('users_roles')
      .where('user_id', '=', userId)
      .innerJoin('roles', 'roles.id', 'users_roles.role_id')
      .select(['roles.id', 'roles.name as name'])
      .execute();
  }

  findById(id: number) {
    return this.client.selectFrom('users').select([
      'id',
      'username',
      'phone',
      'email',
      'last_name',
      'first_name',
      'created_at',
      'discount',
    ]).where('id', '=', id)
      .executeTakeFirst();
  }

  findUsersByIds(ids: number[]) {
    return this.client.selectFrom('users').where('id', 'in', ids).select([
      'first_name',
      'last_name',
      'id',
      'phone',
      'username',
    ]).execute();
  }

  deleteUserById(id: number) {
    return this.client.transaction().execute(async trx => {
      trx.deleteFrom('users').where('id', '=', id);
      trx.deleteFrom('users_roles').where('user_id', '=', id);
      trx.deleteFrom('boxes_masters').where('user_id', '=', id);
    });
  }

  updateUserById(id: number, body: UpdateUserDto) {
    return this.client.updateTable('users')
      .where('id', '=', id)
      .set(body)
      .returningAll()
      .executeTakeFirst();
  }

  async giveRoleToUser(userId: number, role: RolesEnum) {
    const roleRow = await this.client.selectFrom('roles')
      .where('name', '=', role)
      .select('id')
      .executeTakeFirst();

    return this.client.insertInto('users_roles')
      .values({ user_id: userId, role_id: roleRow.id })
      .returning('id')
      .executeTakeFirst();
  }

  async revokeRoleFromUser(userId: number, role: RolesEnum) {
    const roleRow = await this.client.selectFrom('roles')
      .where('name', '=', role)
      .select('id')
      .executeTakeFirst();

    return this.client.deleteFrom('users_roles')
      .where('user_id', '=', userId)
      .where('role_id', '=', roleRow.id)
      .returning('id')
      .executeTakeFirst();
  }

  getUsersList(filters: GetUsersListDto['filters']) {
    let query = this.client.selectFrom('users')
      .innerJoin('users_roles', 'users_roles.user_id', 'users.id')
      .innerJoin('roles', 'roles.id', 'users_roles.role_id')
      .select(sql`json_agg(row_to_json(roles))`.as('roles'))
      .selectAll('users')
      .groupBy('users.id')


    if (filters?.roles?.length) {
      query = query.where('roles.id', 'in', filters.roles);
    }

    return query.execute();
  }

  getRoles() {
    return this.client.selectFrom('roles').execute();
  }
}