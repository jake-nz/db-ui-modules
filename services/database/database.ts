import { DB } from './database.d'
import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely'
import { Pool } from 'pg'

export const database = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    })
  }),
  plugins: [new CamelCasePlugin({ maintainNestedObjectKeys: true })]
})

export const now = sql<Date>`now()`
