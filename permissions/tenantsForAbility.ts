import { type MongoAbility } from '@casl/ability'

/**
 * Return all the tenants for which the ability can perforn `action` on `subject`
 */
export function tenantsForAbility<Action extends string, Subject extends string>(ability: MongoAbility, action: Action, subject: Subject) {
  const tenantIds = []
  for (const rule of ability.rulesFor(action, subject)) {
    if (!rule.conditions?.tenantId) return null
    tenantIds.push(rule.conditions.tenantId as number)
  }
  return tenantIds
}
