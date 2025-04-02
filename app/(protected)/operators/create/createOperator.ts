'use server'
import { assertUserAbility } from '@/services/auth/ability'
import { database } from '@/services/database/database'
import { slugify } from '@/utils/slugify'

type NewOperatorFields = {
  name: string
  region: string
}

export const createOperator = async (values: NewOperatorFields) => {
  await assertUserAbility({ create: 'Operator' })

  const { id } = await database
    .insertInto('operators')
    .values({
      id: slugify(values.name),
      name: values.name,
      region: values.region
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return id
}
