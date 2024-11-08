import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', col => col.defaultTo(sql`nanoid(5)`).primaryKey())
    .addColumn('email', 'text', col => col.unique())
    .addColumn('name', 'text')
    .addColumn('password', 'text', col => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
