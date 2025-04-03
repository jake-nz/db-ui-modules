'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const speciesFetcher = async ({
  page,
  filters,
  sorter,
  pageSize
}: ListQuery & { pageSize?: number }) => {
  let query = database
    .selectFrom('species')
    .leftJoin('outplants', 'species.id', 'outplants.species')
    .select(sb => [
      'species.id',
      'species.species',
      'species.genus',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy(['species.id', 'species.species', 'species.genus'])
    .orderBy(['genus asc', 'species asc'])

  if (filters.genus)
    query = query.where('species.genus', 'in', filters.genus as string[])

  return paginate(query, page, pageSize).execute()
}
