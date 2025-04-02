import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('outplants')
    .alterColumn('originalData', col => col.dropNotNull())
    .execute()
  await db.schema
    .alterTable('outplantDays')
    .alterColumn('originalData', col => col.dropNotNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('outplants')
    .alterColumn('originalData', col => col.setNotNull())
    .execute()
  await db.schema
    .alterTable('outplantDays')
    .alterColumn('originalData', col => col.setNotNull())
    .execute()
}
