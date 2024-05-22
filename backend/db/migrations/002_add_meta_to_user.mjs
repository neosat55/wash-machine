import { Kysely } from 'kysely';

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema.alterTable('users')
    .addColumn('meta', 'json')
    .execute();

  await db.schema
    .createIndex('uniq_bonuses')
    .column('user_id')
    .on('bonuses')
    .unique()
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  // Migration code
}