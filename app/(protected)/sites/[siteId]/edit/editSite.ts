'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'

type SiteFields = {
  name: string
  reefId: string
}

export const editSite = async (id: string, values: SiteFields) => {
  await assertUserAbility({ edit: 'Site' })

  await database
    .updateTable('sites')
    .set({
      name: values.name,
      reef: values.reefId
    })
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  return true
}
