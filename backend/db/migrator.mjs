import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import pg from 'pg';
import process from 'node:process';
import { promises as fs } from 'fs'
import path from 'path';

try {
  process.loadEnvFile("./.env");
} catch (exception) {
  console.log(exception);
}

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionTimeoutMillis: 1000,
    connectionString: process.env.DATABASE_URL
  }),
});

const migrationFolder = new URL('./migrations', import.meta.url).pathname

console.log(migrationFolder);

const db = new Kysely({ dialect, log: ["error"] });

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    migrationFolder: migrationFolder,
    path: path,
  }),
})


const main = async () => {
  const arg = process.argv.slice(2)[0];
  if (arg === 'down') {
    console.log(await migrator.migrateDown());
  } else if (arg === 'up') {
    console.log(await migrator.migrateUp());
  } else if (arg === 'latest') {
    console.log(await migrator.migrateToLatest());
  } else if (arg === 'list') {
    console.log(await migrator.getMigrations());
  }
}

main();