'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'
import { slugify } from '@/utils/slugify'

export type NewSiteFields = {
  name: string
  reefId: string
}

export const createSite = async (values: NewSiteFields) => {
  await assertUserAbility({ create: 'Site' })

  const { id } = await database
    .insertInto('sites')
    .values({
      id: slugify(values.name),
      name: values.name,
      reef: values.reefId
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return id
}
