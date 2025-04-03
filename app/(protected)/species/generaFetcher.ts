'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const generaFetcher = async ({ page, filters, sorter }: ListQuery) => {
  let query = database
    .selectFrom('species')
    // .leftJoin('outplants', 'species.id', 'outplants.species')
    .select(sb => [
      'species.genus'
      // sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy('species.genus')
    .orderBy('genus asc')

  return paginate(query, page).execute()
}
