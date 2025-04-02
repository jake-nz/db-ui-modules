import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('outplantDays')
    .addColumn('crew', 'int2', col => col.notNull().defaultTo(0))
    .addColumn('funding', 'text', col => col.notNull().defaultTo(''))
    .execute()

  await db.schema
    .alterTable('outplantDays')
    .alterColumn('crew', col => col.dropNotNull())
    .alterColumn('crew', col => col.dropDefault())
    .alterColumn('funding', col => col.dropNotNull())
    .alterColumn('funding', col => col.dropDefault())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('outplantDays')
    .dropColumn('crew')
    .dropColumn('funding')
    .execute()
}
