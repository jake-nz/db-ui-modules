'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'
import { slugify } from '@/utils/slugify'

export type NewSpeciesFields = {
  genus: string
  species: string
}

export const createSpecies = async (values: NewSpeciesFields) => {
  await assertUserAbility({ create: 'Species' })

  const { id } = await database
    .insertInto('species')
    .values({
      id: slugify(values.genus + ' ' + values.species),
      genus: values.genus,
      species: values.species
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return id
}
