import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'; export const
testSimples = pgTable('test_simples', { id:
uuid('id').defaultRandom().primaryKey(),
createdAt: timestamp('created_at').defaultNow().notNull(), updatedAt:
timestamp('updated_at').defaultNow().notNull(), }); export type
TestSimpleSchema = typeof
testSimples.$inferSelect;