'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const regionsFetcher = async ({
  page,
  filters,
  sorter,
  pageSize
}: ListQuery & { pageSize?: number }) => {
  let query = database
    .selectFrom('regions')
    .innerJoin('operators', 'operators.region', 'regions.id')
    .leftJoin('outplantDays', 'outplantDays.operator', 'operators.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'regions.id',
      'regions.name',
      'color',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy(['regions.id', 'regions.name', 'color'])
    .orderBy('name asc')

  return paginate(query, page, pageSize).execute()
}
