import { PermissionsTypes } from '@/services/auth/permissions'
import { Roles } from 'castellate'
import NextAuth, { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authorize } from './actions/authorize'

export const { handlers, auth, signIn } = NextAuth({
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

// Auth.js Types

declare module 'next-auth' {
  interface User {
    roles: Roles<PermissionsTypes>
  }
  interface Session {
    user: {
      roles: Roles<PermissionsTypes>
    } & DefaultSession['user']
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    roles: Roles<PermissionsTypes>
  }
}

// We need to import JWT, even though we don't directly use it. This line helps it not look like an unused import
type KeepImport = JWT
