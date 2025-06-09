import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { describe, expect, it } from 'vitest'
import type { AppAbility } from '../types'
import { tenantsForAbility } from '../tenantsForAbility'
import type { PermissionsTypes } from './testPermissions'

const newBuilder = () => new AbilityBuilder<AppAbility<PermissionsTypes>>(createMongoAbility)

describe('tenantsForAbility', () => {
  it('Returns explicit tenants', () => {
    const ability = newBuilder()
    ability.can('read', 'Thing', { tenantId: 33 })
    ability.can('read', 'Thing', { tenantId: 44 })
    const tenants = tenantsForAbility(ability.build(), 'read', 'Thing')
    expect(new Set(tenants)).toEqual(new Set([33, 44]))
  })
  it('Handles all-tenant access', () => {
    const ability = newBuilder()
    ability.can('read', 'Thing', { tenantId: 33 })
    ability.can('read', 'Thing')
    const tenants = tenantsForAbility(ability.build(), 'read', 'Thing')
    expect(tenants).toBeNull()
  })
  it('Handles manage access', () => {
    const ability = newBuilder()
    ability.can('manage', 'Thing', { tenantId: 33 })
    ability.can('manage', 'Thing', { tenantId: 44 })
    const tenants = tenantsForAbility(ability.build(), 'read', 'Thing')
    expect(new Set(tenants)).toEqual(new Set([33, 44]))
  })
  it('Handles insufficient access', () => {
    const ability = newBuilder()
    ability.can('read', 'Thing', { tenantId: 33 })
    ability.can('edit', 'Thing', { tenantId: 44 })
    const tenants = tenantsForAbility(ability.build(), 'edit', 'Thing')
    expect(new Set(tenants)).toEqual(new Set([44]))
  })
  it('Handles insufficient access overriden by all-tenant access', () => {
    const ability = newBuilder()
    ability.can('read', 'Thing', { tenantId: 33 })
    ability.can('edit', 'Thing')
    const tenants = tenantsForAbility(ability.build(), 'edit', 'Thing')
    expect(tenants).toBeNull()
  })
})
