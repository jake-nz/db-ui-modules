'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'

export type OperatorFields = {
  name: string
  region: string
}

export const editOperator = async (id: string, values: OperatorFields) => {
  await assertUserAbility({ edit: 'Operator' })

  await database
    .updateTable('operators')
    .set({
      name: values.name,
      region: values.region
    })
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  return true
}