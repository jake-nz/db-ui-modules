'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { Role } from '@/services/auth/permissions'
import { database } from '@/services/database/database'

type UserFields = {
  name: string
  email: string
  role: Role
  operator?: string
}

export const editUser = async (id: string, values: UserFields) => {
  await assertUserAbility({ edit: 'User' })

  await database
    .updateTable('users')
    .set({
      name: values.name,
      email: values.email,
      role: values.role,
      operatorId: values.operator
    })
    .where('id', '=', id)
    .executeTakeFirstOrThrow()

  return true
}
