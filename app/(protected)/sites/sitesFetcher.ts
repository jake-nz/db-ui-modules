'use server'
import { database } from '@/services/database/database'
// import { InsertObject, UpdateObject } from 'kysely'
import { ListQuery, paginate } from 'snaks'

export const sitesFetcher = async ({ page, filters, sorter }: ListQuery) => {
  let query = database
    .selectFrom('sites')
    .innerJoin('reefs', 'sites.reef', 'reefs.id')
    .leftJoin('operatorsSites', 'sites.id', 'operatorsSites.site')
    .innerJoin('operators', 'operatorsSites.operator', 'operators.id')
    .leftJoin('outplantDays', 'outplantDays.site', 'sites.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'sites.id',
      'sites.name',
      'reefs.name as reef',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy(['sites.id', 'sites.name', 'reefs.name'])
    .orderBy('name asc')

  if (filters.operator) {
    query = query.where('operators.id', 'in', filters.operator as string[])
  }

  return paginate(query, page, 100).execute()
}
