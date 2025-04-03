'use server'
import { database } from '@/services/database/database'
import { sql } from 'kysely'

export const statsFetcher = () => {
  return database
    .selectFrom('outplantDays')
    .innerJoin('operators', 'operators.id', 'outplantDays.operator')
    .innerJoin('outplants', 'outplants.day', 'outplantDays.id')
    .innerJoin('sites', 'sites.id', 'outplantDays.site')
    .select(sb => [
      sql<number>`COUNT(DISTINCT ${sb.ref('species')})`.as('speciesCount'),
      sql<number>`COUNT(DISTINCT ${sb.ref('reef')})`.as('reefCount'),
      sql<number>`COUNT(DISTINCT ${sb.ref('site')})`.as('siteCount'),
      // sb.fn.count('outplantDays.id').as('sessionCount'),
      // sql<number>`COUNT(DISTINCT ${sb.ref('date')})`.as('dateCount'),
      sb.fn.sum('count').as('totalOutplants')
    ])
    .executeTakeFirst()
}
