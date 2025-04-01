'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const reefsFetcher = async ({ page, filters, sorter }: ListQuery) => {
  let query = database
    .selectFrom('reefs')
    .innerJoin('regions', 'reefs.region', 'regions.id')
    .leftJoin('sites', 'sites.reef', 'reefs.id')
    .leftJoin('outplantDays', 'outplantDays.site', 'sites.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'reefs.id',
      'reefs.name',
      'regions.name as region',
      'color',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy(['reefs.id', 'reefs.name', 'regions.name', 'color'])
    .orderBy('name asc')

  return paginate(query, page, 100).execute()
}
