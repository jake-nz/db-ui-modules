import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('regions')
    .alterColumn('color', col => col.setNotNull())
    .execute()
  await db.schema
    .alterTable('regions')
    .addCheckConstraint(
      'color_check',
      sql`color in ('magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple')`
    )
    .execute()
  await db.schema
    .alterTable('regions')
    .addUniqueConstraint('color_unique', ['color'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('regions').dropConstraint('color_check').execute()
  await db.schema.alterTable('regions').dropConstraint('color_unique').execute()
  await db.schema
    .alterTable('regions')
    .alterColumn('color', col => col.dropNotNull())
    .execute()
}
