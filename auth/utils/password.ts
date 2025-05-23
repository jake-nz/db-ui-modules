import bcrypt from 'bcrypt'
import { AuthError } from 'next-auth'

export const assertPassword = async (user: { password: string | null }, credentials: { password: string }) => {
  if (!user.password) throw new AuthError('Invalid user')
  const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
  if (!isCorrectPassword) throw new AuthError('Invalid password')
}
