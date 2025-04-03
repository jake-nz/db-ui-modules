'use server'
import { database } from '@/services/database/database'
import { sql } from 'kysely'
import { iterateSorter, ListQuery, paginate } from 'snaks'

const baseQuery = (filters: ListQuery['filters']) => {
  let query = database
    .selectFrom('outplantDays')
    .innerJoin('operators', 'operators.id', 'outplantDays.operator')
    .innerJoin('regions', 'regions.id', 'operators.region')
    .innerJoin('sites', 'sites.id', 'outplantDays.site')
    // .innerJoin('species', 'species.id', 'outplants.species')
    .leftJoin('reefs', 'reefs.id', 'sites.reef')
    .select(sb => [
      'outplantDays.id',
      'date',
      'operators.name as operator',
      'regions.name as region',
      'regions.color as regionColor',
      'sites.name as site',
      'reefs.name as reef',
      // sql`COUNT(DISTINCT operators.id) OVER()`.as('operatorCount'),
      sb
        .selectFrom('outplants')
        .select(sb => sb.fn.sum('count').as('count'))
        .whereRef('outplants.day', '=', 'outplantDays.id')
        .as('outplantCount')
    ])

  if (filters.date) {
    const [start, end] = filters.date
    query = query.where('date', '>', new Date(Number(start)))
    query = query.where('date', '<', new Date(Number(end)))
  }

  if (filters.operator)
    query = query.where('operators.id', 'in', filters.operator as string[])

  if (filters.region)
    query = query.where('regions.id', 'in', filters.region as string[])

  if (filters.reef)
    query = query.where('reefs.id', 'in', filters.reef as string[])

  return query
}

export const outplantDaysFetcher = async ({
  page,
  filters,
  sorter
}: ListQuery) => {
  let query = baseQuery(filters).orderBy('date', 'desc')

  for (const [column, direction] of iterateSorter(sorter)) {
    switch (column) {
      case 'date':
        query = query.clearOrderBy().orderBy('date', direction)
    }
  }

  return paginate(query, page).execute()
}

export const outplantDaysSummaryFetcher = async ({
  page,
  filters,
  sorter
}: ListQuery) => {
  return database
    .with('cte', _ => baseQuery(filters))
    .selectFrom('cte')
    .select(sb => [
      sql<number>`COUNT(DISTINCT ${sb.ref('operator')})`.as('operatorCount'),
      sql<number>`COUNT(DISTINCT ${sb.ref('reef')})`.as('reefCount'),
      sql<number>`COUNT(DISTINCT ${sb.ref('site')})`.as('siteCount'),
      sql<number>`COUNT(DISTINCT ${sb.ref('region')})`.as('regionCount'),
      sql<number>`COUNT(DISTINCT ${sb.ref('date')})`.as('dateCount'),
      sb.fn.sum('outplantCount').as('totalOutplants')
    ])
    .executeTakeFirst()
}
