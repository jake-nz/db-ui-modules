'use server'
import { sql } from 'kysely'
import { database } from '@database'

export const validateToken = async (token: string) => {
  const validToken = await database
    .selectFrom('users')
    .where('resetToken', '=', token)
    .where('resetTokenExpiresAt', 'is not', null)
    .where('resetTokenExpiresAt', '>', sql<Date>`now()`)
    .executeTakeFirst()

  return Boolean(validToken)
}
