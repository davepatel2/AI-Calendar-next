// drizzle/schema.ts
import { mysqlTable, serial, varchar, datetime } from 'drizzle-orm/mysql-core';

export const events = mysqlTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  start: datetime('start').notNull(),
  end: datetime('end').notNull(),
});
