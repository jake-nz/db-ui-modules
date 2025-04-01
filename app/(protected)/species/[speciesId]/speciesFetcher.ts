'use server'
import { database } from '@/services/database/database'

export const speciesFetcher = async (id: string) => {
  const species = await database
    .selectFrom('species')
    .leftJoin('outplants', 'species.id', 'outplants.species')
    .select(sb => [
      'species.id',
      'species.species',
      'species.genus',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .where('species.id', '=', id)
    .groupBy(['species.id', 'species.species', 'species.genus'])
    .executeTakeFirst()

  if (!species) throw new Error(`Species ${id} not found`)

  return species
}
