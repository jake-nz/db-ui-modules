'use server'
import { database } from '@/services/database/database'

export const siteFetcher = async (id: string) => {
  const site = await database
    .selectFrom('sites')
    .innerJoin('reefs', 'reefs.id', 'sites.reef')
    .innerJoin('regions', 'reefs.region', 'regions.id')
    .leftJoin('outplantDays', 'outplantDays.site', 'sites.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'sites.id',
      'sites.name',
      'reefs.name as reefName',
      'reefs.id as reefId',
      'regions.name as region',
      'regions.id as regionId',
      'regions.color as regionColor',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .where('sites.id', '=', id)
    .groupBy([
      'sites.id',
      'sites.name',
      'reefs.name',
      'reefs.id',
      'regions.name',
      'regions.id',
      'regions.color'
    ])
    .executeTakeFirst()

  if (!site) throw new Error(`Site ${id} not found`)

  return site
}
