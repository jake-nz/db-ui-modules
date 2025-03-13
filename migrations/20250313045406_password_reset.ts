import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('resetToken', 'text', col => col.unique())
    .addColumn('resetTokenExpiresAt', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .dropColumn('resetToken')
    .dropColumn('resetTokenExpiresAt')
    .execute()
}
