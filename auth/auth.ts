import { getUser } from '@/services/auth/getUser'
import NextAuth, { AuthError } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authorize = async (credentials: { username?: unknown; password?: unknown }) => {
  try {
    const { username, password } = credentials
    if (typeof username !== 'string' || typeof password !== 'string') throw new AuthError('Invalid credentials')

    return await getUser({ username, password })
  } catch (e) {
    if (e instanceof AuthError) return null
    throw e
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [CredentialsProvider({ authorize })],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.roles = user.roles
      return token
    },
    session: async ({ session, token }) => ({
      ...session,
      user: { ...session.user, roles: token.roles }
    })
  }
})

// We need to import JWT so we can extend the interface, This line helps it not look like an unused import
type KeepImport = JWT
