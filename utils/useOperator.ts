import { useSession } from 'next-auth/react'

export const useOperator = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') return false
  if (status === 'unauthenticated') return false
  if (!session) return false

  const roles = session.user?.roles
  return 'wavelength' //roles[0].tenantId
}
