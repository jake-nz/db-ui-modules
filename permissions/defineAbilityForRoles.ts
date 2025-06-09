import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { extendAbility } from './extendAbility'
import type { AppAbility, Permissions, PermissionsBase, Roles } from './types'

export function defineAbilityForRoles<P extends PermissionsBase>(rolePermissions: Permissions<P>, roles: Roles<P>, userId?: P['UserId']) {
  const builder = new AbilityBuilder<AppAbility<P>>(createMongoAbility)

  for (const { role, tenantId } of roles) {
    const definePermissions = rolePermissions[role]
    if (!definePermissions) throw new Error(`unknown role ${role}`)
    definePermissions(builder, { tenantId, userId })
  }

  const ability = builder.build()

  return extendAbility(ability)
}
