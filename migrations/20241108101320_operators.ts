import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('regions')
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .execute()

  await db
    .insertInto('regions')
    .values([
      { id: 'CPD', name: 'Cairns / Port Douglas' },
      { id: 'WS', name: 'Whitsundays' }
    ])
    .execute()

  await db.schema
    .createTable('operators')
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('region', 'text', col => col.notNull().references('regions.id'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('operators').execute()
  await db.schema.dropTable('regions').execute()
}
