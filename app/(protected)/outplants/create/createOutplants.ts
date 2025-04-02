'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'
import { Origin } from '@/services/database/database.types'

type NewOutplantsFields = {
  date: Date
  operator: string
  site: string
  crew: number
  funding: string
  outplants: Array<{
    species: string
    morphology: string
    count: number
    origin: Origin
  }>
}

export const createOutplants = async (values: NewOutplantsFields) => {
  await assertUserAbility({ create: 'Outplant' })

  const { id } = await database.transaction().execute(async trx => {
    const outplantDay = await trx
      .insertInto('outplantDays')
      .values({
        date: values.date,
        operator: values.operator,
        site: values.site,
        crew: values.crew,
        funding: values.funding
      })
      .returning('id')
      .executeTakeFirstOrThrow()

    const outplants = values.outplants
      .filter(
        outplant =>
          outplant.morphology &&
          outplant.origin &&
          outplant.species &&
          outplant.count
      )
      .map(outplant => ({
        day: outplantDay.id,
        morph: outplant.morphology,
        origin: outplant.origin,
        species: outplant.species,
        count: outplant.count
      }))

    await trx.insertInto('outplants').values(outplants).execute()

    return outplantDay
  })

  return id
}
