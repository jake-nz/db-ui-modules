'use server'
import { database } from '@/services/database/database'
// import { InsertObject, UpdateObject } from 'kysely'
import { ListQuery, paginate } from 'snaks'

export const outplantsFetcher = async ({
  page,
  filters,
  sorter
}: ListQuery) => {
  let query = database
    .selectFrom('outplants')
    .innerJoin('operators', 'operators.id', 'outplants.operator')
    .innerJoin('regions', 'regions.id', 'operators.region')
    .innerJoin('sites', 'sites.id', 'outplants.site')
    .innerJoin('species', 'species.id', 'outplants.species')
    .leftJoin('reefs', 'reefs.id', 'sites.reef')
    .select(sb => [
      'outplants.id',
      'date',
      'count',
      'morph',
      'operators.name as operator',
      'regions.name as region',
      'regions.color as regionColor',
      'origin',
      'sites.name as site',
      'reefs.name as reef',
      'species.species',
      'species.genus',
      'notes'
    ])
    .orderBy('date desc')

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
