import { auth } from '@/modules/auth/auth'
import { PermissionsTypes } from '@/services/permissions/permissions'
import { abilityFromSession } from './abilityFromSession'
import { CanArgs } from './extendAbility'

export const assertUserCan = async (...args: CanArgs<PermissionsTypes>) => {
  const session = await auth()
  const ability = abilityFromSession(session)
  return ability.assertCan(...args)
}
