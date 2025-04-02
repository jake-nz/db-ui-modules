'use server'
import { database } from '@/services/database/database'

export const regionFetcher = async ({ regionId }: { regionId: string }) => {
  const region = await database
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
    .where('regions.id', '=', regionId)
    .groupBy(['regions.id', 'regions.name', 'color'])
    .executeTakeFirst()

  if (!region) throw new Error(`Region ${regionId} not found`)

  return region
}
