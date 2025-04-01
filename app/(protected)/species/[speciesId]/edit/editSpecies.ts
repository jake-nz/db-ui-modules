'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'

export type SpeciesFields = {
  genus: string
  species: string
}

export const editSpecies = async (id: string, values: SpeciesFields) => {
  await assertUserAbility({ edit: 'Species' })

  await database
    .updateTable('species')
    .set({
      genus: values.genus,
      species: values.species
    })
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  return true
}
