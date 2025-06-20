import { FactoryProvider } from '@nestjs/common';
import { Pool } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

export const DRIZZLE_ORM_TOKEN = 'DRIZZLE_ORM_TOKEN';

export const DrizzleOrmProvider: FactoryProvider<NodePgDatabase<typeof schema>> = {
  provide: DRIZZLE_ORM_TOKEN,
  useFactory: async () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    return drizzle(pool, { schema });
  },
};
