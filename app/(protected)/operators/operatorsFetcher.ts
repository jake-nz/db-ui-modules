'use server'
import { database } from '@/services/database/database'
// import { InsertObject, UpdateObject } from 'kysely'
import { ListQuery, paginate } from 'snaks'

export const operatorsFetcher = async ({
  page,
  filters,
  sorter
}: ListQuery) => {
  let query = database
    .selectFrom('operators')
    .innerJoin('regions', 'operators.region', 'regions.id')
    .leftJoin('outplantDays', 'outplantDays.operator', 'operators.id')
    .leftJoin('outplants', 'outplants.day', 'outplantDays.id')
    .select(sb => [
      'operators.id',
      'operators.name',
      'regions.name as region',
      'color as regionColor',
      sb.fn.sum('count').as('totalOutplants')
    ])
    .groupBy(['operators.id', 'operators.name', 'regions.name', 'color'])
    .orderBy('name asc')

  return paginate(query, page, 100).execute()
}

// export const eventFetcher = async (id: string) => {
//   const event = database
//     .selectFrom('events')
//     .selectAll()
//     .where('id', '=', id)
//     .executeTakeFirstOrThrow()
//   const cash = database
//     .selectFrom('cash')
//     .selectAll()
//     .where('eventId', '=', id)
//     .execute()
//   return { event: await event, cash: await cash }
// }

// export const eventCreate = async (data: InsertObject<DB, 'events'>) =>
//   await database
//     .insertInto('events')
//     .values(data)
//     .returningAll()
//     .executeTakeFirstOrThrow()

// export const eventUpdate = async (
//   id: string,
//   data: UpdateObject<DB, 'events'>
// ) => {
//   await database
//     .updateTable('events')
//     .set(data)
//     .where('id', '=', id)
//     .executeTakeFirstOrThrow()
// }
