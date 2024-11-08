import { defineConfig } from 'kysely-ctl'
import { database } from './services/database/database'

export default defineConfig({
  kysely: database
  //   migrations: {
  //     getMigrationPrefix: getKnexTimestampPrefix,
  //   },
})
