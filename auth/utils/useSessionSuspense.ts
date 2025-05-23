import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export const useSessionSuspense = () => {
  const { data: session, status } = useSession()

  {
    // Trigger suspense

    // We need to useSearchParams to stop Next trying to static render this
    // page at build time. It will try to wait forever for this promise
    useSearchParams()
    if (status === 'loading') throw new Promise(() => {})
  }

  if (status === 'unauthenticated') return null

  return session
}
