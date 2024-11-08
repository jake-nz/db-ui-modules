import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import {
  AbilityRequirements,
  assertAbilityRequirements,
  defineAbilityForRoles,
  destructurableAbility
} from 'castellate'
import { PermissionsTypes, permissions } from './permissions'

class AuthRequiredError extends Error {
  name = 'AuthRequiredError'
}

export const useAssertAbility = (
  required?: AbilityRequirements<PermissionsTypes>
) => {
  const ability = useAbility()
  if (!ability) throw new AuthRequiredError()

  assertAbilityRequirements(ability, required)

  return ability
}

export const useAbility = () => {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') return null

  // Trigger suspense
  // We need to useSearchParams to stop Next trying to static render this
  // page at build time. It will try to wait forever for this promise
  useSearchParams()
  if (status === 'loading') throw new Promise(() => {})

  if (!session) return null

  const roles = session.user?.roles

  if (roles === undefined) return null

  const userAbility = defineAbilityForRoles<PermissionsTypes>(
    permissions,
    roles
  )

  return destructurableAbility(userAbility)
}
