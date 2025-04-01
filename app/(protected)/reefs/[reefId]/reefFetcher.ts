'use server'
import { database } from '@/services/database/database'

export const reefFetcher = async (id: string) => {
  const reef = await database
    .selectFrom('reefs')
    .innerJoin('regions', 'reefs.region', 'regions.id')
    .leftJoin('sites', 'sites.reef', 'reefs.id')
    .leftJoin('outplantDays', 'outplantDays.site', 'sites.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'reefs.id',
      'reefs.name',
      'regions.name as region',
      'regions.id as regionId',
      'regions.color as regionColor',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .where('reefs.id', '=', id)
    .groupBy([
      'reefs.id',
      'reefs.name',
      'regions.name',
      'regions.id',
      'regions.color'
    ])
    .executeTakeFirst()

  if (!reef) throw new Error(`Reef ${id} not found`)

  return reef
}
