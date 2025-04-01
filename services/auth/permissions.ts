import { CastellateBase, destructurableAbility, Permissions } from 'castellate'

export type Role = 'Admin' | 'Staff' | 'Operator'

export type PermissionsTypes = {
  UserId: number
  Tenant: string | null // Users may belong to an operator and operator IDs are strings
  Role: Role
  Subject:
    | 'User'
    | 'Operator'
    | 'Species'
    | 'Outplant'
    | 'Region'
    | 'Reef'
    | 'Site'
    | 'all'
  Action: CastellateBase['Action'] // defaults
} & CastellateBase

export const permissions: Permissions<PermissionsTypes> = {
  Admin({ can: allow, cannot: forbid }) {
    allow('manage', 'all')
  },
  Staff({ can: allow, cannot: forbid }, { userId }) {
    // Can do everything
    allow('manage', 'all')
    // Except manage users
    forbid('manage', 'User')
  },
  Operator({ can: allow, cannot: forbid }, { tenantId }) {
    allow('manage', 'Operator', { id: tenantId })
    // TODO - more permissions as needed
  }
}

// Hack, have castellate export AppAbility, which is: ReturnType<typeof destructurableAbility<PermissionsTypes>>
export type Abilty = ReturnType<typeof destructurableAbility<PermissionsTypes>>
