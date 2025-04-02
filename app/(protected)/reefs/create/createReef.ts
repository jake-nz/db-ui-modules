'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'
import { slugify } from '@/utils/slugify'

type NewReefFields = {
  name: string
  regionId: string
}

export const createReef = async (values: NewReefFields) => {
  await assertUserAbility({ create: 'Reef' })

  const { id } = await database
    .insertInto('reefs')
    .values({
      id: slugify(values.name),
      name: values.name,
      region: values.regionId
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return id
}
