'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const operatorsFetcher = async ({
  page,
  filters,
  sorter,
  pageSize
}: ListQuery & { pageSize?: number }) => {
  let query = database
    .selectFrom('operators')
    .innerJoin('regions', 'operators.region', 'regions.id')
    .leftJoin('outplantDays', 'outplantDays.operator', 'operators.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'operators.id',
      'operators.name',
      'regions.name as region',
      'color as regionColor',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy(['operators.id', 'operators.name', 'regions.name', 'color'])
    .orderBy('name asc')

  if (filters.region)
    query = query.where('regions.id', 'in', filters.region as string[])

  return paginate(query, page, pageSize).execute()
}
