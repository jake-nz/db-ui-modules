import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create origin enum
  sql`CREATE TYPE origin AS ENUM ('Fragment of Opportunity', 'Donor Colony', 'Nursery');`.execute(
    db
  )

  await db.schema
    .createTable('outplants')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('date', 'timestamptz', col => col.notNull())
    .addColumn('operator', 'text', col =>
      col.notNull().references('operators.id')
    )
    .addColumn('site', 'text', col => col.notNull().references('sites.id'))
    .addColumn('species', 'text', col => col.notNull().references('species.id'))
    .addColumn('morph', 'text', col => col.notNull())
    .addColumn('count', 'int2', col => col.notNull())
    .addColumn('origin', sql`origin`, col => col.notNull())
    .addColumn('notes', 'text')
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('originalData', 'jsonb', col => col.notNull())
    .addUniqueConstraint('unique_outplanting', [
      'date',
      'operator',
      'species',
      'site',
      'morph',
      'origin'
    ])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('outplants').execute()
  sql`DROP TYPE IF EXISTS origin;`.execute(db)
}
