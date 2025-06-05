import { type MongoAbility } from '@casl/ability'
import { User } from 'next-auth'

type TenantType = Exclude<User['roles'][number]['tenantId'], null>

/**
 * Return all the tenants for which the ability can perforn `action` on `subject`
 */
export function tenantsForAbility<Action extends string, Subject extends string>(
  ability: { rulesFor: MongoAbility['rulesFor'] },
  action: Action,
  subject: Subject,
  tenantIdProp: string
) {
  const tenantIds = new Set<TenantType>()
  for (const rule of ability.rulesFor(action, subject)) {
    if (!rule.conditions?.[tenantIdProp]) return null
    if (rule.inverted) {
      tenantIds.delete(rule.conditions[tenantIdProp] as TenantType)
    } else {
      tenantIds.add(rule.conditions[tenantIdProp] as TenantType)
    }
  }
  return Array.from(tenantIds)
}
