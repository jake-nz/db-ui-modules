'use server'
import { database } from '@/services/database/database'
import { ListQuery, paginate } from 'snaks'

export const outplantsFetcher = async ({
  page,
  filters,
  sorter
}: ListQuery) => {
  let query = database
    .selectFrom('outplants')
    .innerJoin('species', 'species.id', 'outplants.species')
    .select([
      'outplants.id',
      'outplants.day',
      'species.id as speciesId',
      'species.genus',
      'species.species',
      'outplants.count',
      'outplants.origin',
      'outplants.morph',
      'outplants.notes',
      'outplants.createdAt',
      'outplants.originalData'
    ])
    .orderBy(['species.genus', 'species.species'])

  if (filters.dayId)
    query = query.where('outplants.day', 'in', filters.dayId as number[])

  return paginate(query, page).execute()
}
