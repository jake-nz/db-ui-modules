'use server'
import { Role } from '@/services/auth/permissions'
import { database } from '@/services/database/database'
import bcrypt from 'bcrypt'
import { User } from 'next-auth'

export const authorize = async (credentials: {
  username?: unknown
  password?: unknown
}) => {
  const { username: email, password } = credentials as {
    username: string
    password: string
  }

  const user = await database
    .selectFrom('users')
    .select(['id', 'name', 'password', 'role', 'operatorId'])
    .where('email', '=', email)
    .executeTakeFirst()

  if (!user || !user.password) return null

  const isCorrectPassword = await bcrypt.compare(password, user.password)
  if (!isCorrectPassword) return null

  return {
    id: user.id,
    name: user.name,
    email: email,
    roles: [{ tenantId: user.operatorId, role: user.role }]
  } as User
}
