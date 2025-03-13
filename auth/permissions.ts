import { CastellateBase, Roles, Permissions } from 'castellate'
import { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type Role = 'Admin' | 'Staff' | 'Operator'

export type PermissionsTypes = {
  UserId: number
  Tenant: string | null // Users may belong to an operator and operator IDs are strings
  Role: Role
  Subject: 'User' | 'Operator' | 'all'
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
    // But can edit self
    allow('read', 'User', { id: userId })
    allow('edit', 'User', { id: userId })
  },
  Operator({ can: allow, cannot: forbid }, { tenantId }) {
    allow('manage', 'Operator', { id: tenantId })
    // TODO - more permissions as needed
  }
}

// We need to import JWT, even though we don't directly use it. This line helps it not look like an unused import
type KeepImport = JWT

declare module 'next-auth' {
  interface User {
    roles: Roles<PermissionsTypes>
  }
  interface Session {
    user: {
      roles: Roles<PermissionsTypes>
    } & DefaultSession['user']
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    roles: Roles<PermissionsTypes>
  }
}
