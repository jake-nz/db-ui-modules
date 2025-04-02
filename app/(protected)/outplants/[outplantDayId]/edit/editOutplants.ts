'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'
import { Origin } from '@/services/database/database.types'

type OutplantFields = {
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
    key: number
  }>
}

export const editOutplants = async (id: number, values: OutplantFields) => {
  await assertUserAbility({ edit: 'Outplant' })

  await database.transaction().execute(async trx => {
    // Update the outplant day
    await trx
      .updateTable('outplantDays')
      .set({
        date: values.date,
        operator: values.operator,
        site: values.site,
        crew: values.crew,
        funding: values.funding
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow()

    // Get the IDs of all the outplants that are still in the data
    const remainingOutplants = values.outplants
      // Existing outplants have numeric ID, new ones have a nanoID key
      .filter(outplant => typeof outplant.key === 'number')
      .map(outplant => outplant.key)

    // Delete all the outplants that are no longer in the data
    await trx
      .deleteFrom('outplants')
      .where('day', '=', id)
      .where('id', 'not in', remainingOutplants)
      .execute()

    // Update existing and insert new outplants
    for (const outplant of values.outplants) {
      console.log(outplant)
      // The last row is blank so we can skip it
      if (!outplant.species) continue

      const outplantData = {
        morph: outplant.morphology,
        origin: outplant.origin,
        species: outplant.species,
        count: outplant.count
      }

      // New outplants have a nanoID key
      if (typeof outplant.key === 'string') {
        await trx
          .insertInto('outplants')
          .values({ day: id, ...outplantData })
          .execute()
        continue
      }

      // Existing outplants have numeric ID
      if (typeof outplant.key === 'number') {
        await trx
          .updateTable('outplants')
          .set(outplantData)
          .where('day', '=', id)
          .where('id', '=', outplant.key)
          .execute()
      }
    }
  })

  return true
}
