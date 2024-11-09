import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('species')
    .addColumn('id', 'text', col => col.primaryKey())
    .addColumn('species', 'text')
    .addColumn('genus', 'text', col => col.notNull())
    .addUniqueConstraint('unique_genus_species', ['genus', 'species'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('species').execute()
}
