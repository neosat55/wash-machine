import { Kysely } from 'kysely';

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema.createTable('garage')
    .addColumn('id', 'integer', (c) => c.generatedAlwaysAsIdentity().primaryKey())
    .addColumn('user_id', 'integer')
    .addColumn('car_number', 'text')
    .addUniqueConstraint('user_id-car_number', ['car_number', 'user_id'])
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  // Migration code
}