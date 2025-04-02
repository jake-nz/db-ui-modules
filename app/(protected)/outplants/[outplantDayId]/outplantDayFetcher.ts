'use server'
import { database } from '@/services/database/database'

export const outplantDayFetcher = async (id: number) => {
  const outplantDay = await database
    .selectFrom('outplantDays')
    .innerJoin('operators', 'operators.id', 'outplantDays.operator')
    .innerJoin('sites', 'sites.id', 'outplantDays.site')
    .innerJoin('reefs', 'reefs.id', 'sites.reef')
    .innerJoin('regions', 'regions.id', 'reefs.region')

    .select([
      'operators.id as operatorId',
      'operators.name as operator',
      'regions.name as region',
      'regions.id as regionId',
      'regions.color as regionColor',
      'sites.id as siteId',
      'sites.name as site',
      'reefs.id as reefId',
      'reefs.name as reef',
      'date',
      'crew',
      'funding'
    ])
    .where('outplantDays.id', '=', id)

    .executeTakeFirst()

  if (!outplantDay) throw new Error(`Outplant Day ${id} not found`)

  return outplantDay
}
