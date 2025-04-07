import { auth } from '@/modules/auth/auth'
import { PermissionsTypes, permissions } from '@/services/auth/permissions'
import {
  AbilityRequirements,
  assertAbilityRequirements,
  defineAbilityForRoles,
  destructurableAbility
} from 'castellate'
import { Session } from 'next-auth'

export class AuthRequiredError extends Error {
  name = 'AuthRequiredError'
}

export const emptyAbility = defineAbilityForRoles<PermissionsTypes>(
  permissions,
  []
)

export const abilityFromSession = (session: Session | null) => {
  if (!session) return emptyAbility

  const roles = session.user?.roles

  const userAbility = defineAbilityForRoles<PermissionsTypes>(
    permissions,
    roles
  )

  return destructurableAbility(userAbility)
}

export const assertUserAbility = async (
  required?: AbilityRequirements<PermissionsTypes>
) => {
  const session = await auth()
  const ability = abilityFromSession(session)
  if (!ability) throw new AuthRequiredError()

  assertAbilityRequirements(ability, required)

  return session
}
