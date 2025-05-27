import { describe, expect, it, vi } from 'vitest'
import type { Permissions, Roles } from '../types'
import { AbilityBuilder } from '@casl/ability'
import type { PermissionsTypes } from './testPermissions'
import { defineAbilityForRoles } from '../defineAbilityForRoles'

const testPermissions: Permissions<PermissionsTypes> = {
  Public({ can: allow, cannot: forbid }) {
    // No permissions
  },
  Admin({ can: allow, cannot: forbid }, { userId, tenantId }) {
    // Can do everything
    allow('manage', 'all', { tenantId })
  },
  User({ can: allow, cannot: forbid }, { userId, tenantId }) {
    // Read only access to Things from the right tenant
    allow('read', 'Thing', { tenantId })
    // Can edit their own user
    allow('edit', 'User', { id: userId })
  }
}

describe('defineAbilityForRoles', () => {
  it('calls the permissions functions', () => {
    const permissions: Permissions<PermissionsTypes> = {
      Public: vi.fn(),
      Admin: vi.fn(),
      User: vi.fn()
    }
    const roles: Roles<PermissionsTypes> = [
      { tenantId: 'Client-A', role: 'Admin' },
      { tenantId: 'Client-B', role: 'User' }
    ]

    defineAbilityForRoles(permissions, roles)

    expect(permissions.Public).not.toHaveBeenCalled()

    expect(permissions.Admin).toHaveBeenCalledWith(expect.any(AbilityBuilder), {
      tenantId: 'Client-A'
    })
    expect(permissions.User).toHaveBeenCalledWith(expect.any(AbilityBuilder), {
      tenantId: 'Client-B'
    })
  })

  describe('returned ability', () => {
    const userId = 1
    const roles: Roles<PermissionsTypes> = [
      { tenantId: 'Client-A', role: 'Admin' },
      { tenantId: 'Client-B', role: 'User' }
    ]
    const ability = defineAbilityForRoles(testPermissions, roles, userId)

    it('handles general objects', () => {
      expect(ability.can('read', 'Thing')).toBe(true)
      expect(ability.can('edit', 'User')).toBe(true)
    })

    it('handles tenant-specific objects', () => {
      const thingA = { tenantId: 'Client-A' }
      const thingB = { tenantId: 'Client-B' }
      const userA = { tenantId: 'Client-A' }
      const userB = { tenantId: 'Client-B' }
      expect(ability.can('read', 'Thing', thingA)).toBe(true)
      expect(ability.can('read', 'Thing', thingB)).toBe(true)
      expect(ability.can('read', 'User', userA)).toBe(true)
      expect(ability.can('read', 'User', userB)).toBe(false)
    })

    it('handles user-specific objects', () => {
      const self = { tenantId: 'Client-B', id: userId }
      expect(ability.can('edit', 'User', self)).toBe(true)

      const other = { tenantId: 'Client-B', id: 2 }
      expect(ability.can('edit', 'User', other)).toBe(false)
    })
  })

  it('throws on unknown role', () => {
    const roles: Roles<PermissionsTypes> = [
      {
        tenantId: 'Client-A',
        role: 'Fish' as PermissionsTypes['Role']
      }
    ]

    expect(() => defineAbilityForRoles(testPermissions, roles)).toThrowError('unknown role Fish')
  })
})
