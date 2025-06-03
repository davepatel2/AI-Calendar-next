// src/db/index.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema';

const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'ai_calendar',
  
});

export const db = drizzle(connection, {
  schema,
  mode: 'default',
});
