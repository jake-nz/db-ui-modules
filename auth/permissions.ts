import { CastellateBase, Roles, Permissions } from 'castellate'
import { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type Role = 'Public' | 'Admin' | 'Operator'

export type PermissionsTypes = {
  UserId: number
  Tenant: null // Not multi tenant
  Role: Role
  Subject: 'User' | 'Operator' | 'all'
  Action: CastellateBase['Action'] // defaults
} & CastellateBase

export const permissions: Permissions<PermissionsTypes> = {
  Public({ can: allow, cannot: forbid }, { userId }) {
    // No permissions
  },
  Admin({ can: allow, cannot: forbid }) {
    allow('manage', 'all')
  },
  Operator({ can: allow, cannot: forbid }) {
    // allow('manage', 'Operator')
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
