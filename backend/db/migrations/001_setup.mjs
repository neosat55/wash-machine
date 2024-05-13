import { Kysely, sql } from 'kysely';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  const migrationPath = path.join(process.cwd(), 'db', 'migrations', 'seeds');

  const seeds = await readFile(path.join(migrationPath, 'init.sql'));
  const schema = await readFile(path.join(migrationPath, 'schema.sql'));

  await sql(schema.toString('utf-8')).execute(db);
  await sql(seeds.toString('utf-8')).execute(db);
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  // Migration code
}