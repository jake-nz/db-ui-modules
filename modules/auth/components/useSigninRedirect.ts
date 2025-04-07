import { redirect, usePathname } from 'next/navigation'

export const useSigninRedirect = () => {
  const pathname = usePathname()

  return () => redirect(`/auth/signin?redirect=${pathname}`)
}
