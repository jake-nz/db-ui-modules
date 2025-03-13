import bcrypt from 'bcrypt'
import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from './permissions'
import { database } from '@/services/database/database'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  pages: {
    signIn: '/auth/signin'
  },
  providers: [
    CredentialsProvider({
      name: 'email',
      credentials: {
        username: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@exmaple.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
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
          roles: [{ tenantId: null, role: 'Admin' as Role }]
        } as User
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user, ...p }) {
      if (user) token.roles = user.roles
      return token
    },
    async session({ session, token, user, trigger, ...p }) {
      return {
        ...session,
        user: { ...session.user, roles: token.roles }
      }
    }
  }
})
