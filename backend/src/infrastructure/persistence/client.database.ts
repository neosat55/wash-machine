import { Kysely, PostgresDialect } from "kysely";
import {Pool} from 'pg'

import { DB as Public } from "./database/schema/database.schema";
import * as process from 'node:process';
import { Injectable } from '@nestjs/common';

const DEFAULT_POOL_CAPACITY = 10;

export const ClientName = Symbol('ClientName');

@Injectable()
export class Client {
  public connection: Kysely<Public>;

  constructor() {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionTimeoutMillis: 1000,
        connectionString: process.env.DATABASE_URL,
        max: DEFAULT_POOL_CAPACITY,
      }),
    });
    this.connection = new Kysely<Public>({ dialect, log: ["query", "error"] });
  }

  destroy() {
    return this.connection.destroy();
  }
}
