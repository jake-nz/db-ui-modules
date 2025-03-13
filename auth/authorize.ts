'use server'
import { database } from '@/services/database/database'
import bcrypt from 'bcrypt'
import { User } from 'next-auth'
import { Role } from '../services/auth/permissions'

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
    .select(['id', 'name', 'password'])
    .where('email', '=', email)
    .executeTakeFirst()

  if (!user || !user.password) return null

  const isCorrectPassword = await bcrypt.compare(password, user.password)
  if (!isCorrectPassword) return null

  return {
    id: user.id,
    name: user.name,
    email: email,
    // TODO Roles
    roles: [{ tenantId: null, role: 'Admin' as Role }]
  } as User
}
