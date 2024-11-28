import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('outplantDays')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('date', 'timestamptz', col => col.notNull())
    .addColumn('operator', 'text', col =>
      col.notNull().references('operators.id')
    )
    .addColumn('site', 'text', col => col.notNull().references('sites.id'))
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addColumn('originalData', 'jsonb', col => col.notNull())
    .addUniqueConstraint('unique_outplant_day', ['date', 'operator', 'site'])
    .execute()

  const cols = [
    'id',
    'date',
    'operator',
    'site',
    'created_at',
    'originalData'
  ] as const

  await db
    .insertInto('outplantDays')
    .columns(cols)
    .expression(eb =>
      eb
        .selectFrom('outplants')
        .select(cols)
        .distinctOn(['date', 'operator', 'site'])
    )
    .execute()

  sql`SELECT setval('outplant_days_id_seq', (SELECT MAX(id) FROM ${sql.ref('outplantDays')}) + 1);`.execute(
    db
  )

  await db.schema
    .alterTable('outplants')
    .addColumn('day', 'integer', cb => cb.references('outplantDays.id'))
    .execute()

  await db
    .updateTable('outplants')
    .set(eb => ({
      day: eb
        .selectFrom('outplantDays')
        .select('id')
        .whereRef('outplantDays.date', '=', 'outplants.date')
        .whereRef('outplantDays.operator', '=', 'outplants.operator')
        .whereRef('outplantDays.site', '=', 'outplants.site')
        .limit(1)
    }))
    .execute()

  await db.schema
    .alterTable('outplants')
    .alterColumn('day', cb => cb.dropNotNull())
    .dropColumn('date')
    .dropColumn('operator')
    .dropColumn('site')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error('Not implemented')
}
