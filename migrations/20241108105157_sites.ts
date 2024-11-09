import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('sites')
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('reef', 'text', col => col.notNull().references('reefs.id'))
    .execute()

  await db.schema
    .createTable('operatorsSites')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('operator', 'text', col =>
      col.notNull().references('operators.id')
    )
    .addColumn('site', 'text', col => col.notNull().references('sites.id'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('sites').execute()
  await db.schema.dropTable('operatorsSites').execute()
}
