import { config } from '@/config'
import { DB } from './database.types'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

export const database = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.DATABASE_URL
    })
  }),
  plugins: [new CamelCasePlugin({ maintainNestedObjectKeys: true })]
})
