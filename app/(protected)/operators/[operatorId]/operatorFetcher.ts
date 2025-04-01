'use server'
import { database } from '@/services/database/database'

export const operatorFetcher = async (id: string) => {
  const operator = await database
    .selectFrom('operators')
    .innerJoin('regions', 'operators.region', 'regions.id')
    .leftJoin('outplantDays', 'outplantDays.operator', 'operators.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'operators.id',
      'operators.name',
      'regions.name as region',
      'regions.id as regionId',
      'regions.color as regionColor',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .where('operators.id', '=', id)
    .groupBy([
      'operators.id',
      'operators.name',
      'regions.name',
      'regions.id',
      'regions.color'
    ])
    .executeTakeFirst()

  if (!operator) throw new Error(`Operator ${id} not found`)

  return operator
}
