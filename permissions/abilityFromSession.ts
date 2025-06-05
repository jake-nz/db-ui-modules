import { permissions, PermissionsTypes } from '@/services/auth/permissions'
import { PureAbility } from '@casl/ability'
import { Session } from 'next-auth'
import { defineAbilityForRoles } from './defineAbilityForRoles'
import { extendAbility } from './extendAbility'
import type { AppAbility, PermissionsBase } from './types'

// An ability that can't do anything
export const emptyAbility = extendAbility(new PureAbility() as AppAbility<PermissionsBase>)

export const abilityFromSession = (session: Session | null) => {
  if (!session) return emptyAbility

  const roles = session.user?.roles

  // const rolesOverride = [
  //   {
  //     role: 'volunteer',
  //     tenantId: 'VWuPP17nxyXpL4'
  //   },
  //   {
  //     role: 'volunteer',
  //     tenantId: 'yL13WxfRYUfCKE'
  //   },
  //   {
  //     role: 'volunteer',
  //     tenantId: '7XpuR3uxtdIHkJ'
  //   }
  // ]

  return defineAbilityForRoles<PermissionsTypes>(permissions, roles)
}
