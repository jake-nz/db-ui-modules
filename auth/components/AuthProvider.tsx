import { SessionProvider } from 'next-auth/react'
import { auth } from '@/modules/auth/auth'
import { ReactNode } from 'react'

/**
 * Server component providing session to all pages. Avoids loading state on client.
 */
export const AuthProvider = async ({ children }: { children: ReactNode }) => {
  const session = await auth()
  return <SessionProvider session={session}>{children}</SessionProvider>
}
