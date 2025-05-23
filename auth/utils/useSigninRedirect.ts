import { redirect, usePathname } from 'next/navigation'
import { useSessionSuspense } from './useSessionSuspense'

export const useSigninRedirect = () => {
  const session = useSessionSuspense()
  const pathname = usePathname()

  if (!session) return redirect(`/auth/signin?redirect=${pathname}`)

  return null
}
