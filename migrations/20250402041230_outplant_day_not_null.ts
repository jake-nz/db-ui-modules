import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('outplants')
    .alterColumn('day', cb => cb.setNotNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('outplants')
    .alterColumn('day', cb => cb.dropNotNull())
    .execute()
}
