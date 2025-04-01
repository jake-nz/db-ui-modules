'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'

export type ReefFields = {
  name: string
  region: string
}

export const editReef = async (id: string, values: ReefFields) => {
  await assertUserAbility({ edit: 'Reef' })

  await database
    .updateTable('reefs')
    .set({
      name: values.name,
      region: values.region
    })
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  return true
}
