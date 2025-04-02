'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'

type ReefFields = {
  name: string
  regionId: string
}

export const editReef = async (id: string, values: ReefFields) => {
  await assertUserAbility({ edit: 'Reef' })

  await database
    .updateTable('reefs')
    .set({
      name: values.name,
      region: values.regionId
    })
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  return true
}
