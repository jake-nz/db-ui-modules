'use server'
import { database } from '@/services/database/database'
import bcrypt from 'bcrypt'
import { sql } from 'kysely'

export const resetPassword = async ({
  token,
  password
}: {
  token: string
  password: string
}) => {
  // Find the user with this token and check it's not expired
  const user = await database
    .selectFrom('users')
    .select('id')
    .where('resetToken', '=', token)
    .where('resetTokenExpiresAt', 'is not', null)
    .where('resetTokenExpiresAt', '>', sql<Date>`now()`)
    .executeTakeFirst()

  if (!user) return { error: 'Invalid or expired token' }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Update the user's password and clear the reset token
  await database
    .updateTable('users')
    .set({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
}
