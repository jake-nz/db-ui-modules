import type { PermissionsBase, Permissions } from '../types'

export type PermissionsTypes = {
  // The type of user IDs in your system (eg. number or string)
  UserId: number
  // The type of tenantId (eg. number or string) or null if not multi-tenant
  Tenant: string
  // Roles users can have
  Role: 'Public' | 'Admin' | 'User'
  // Subjects within you system that users may have access to
  Subject: 'Thing' | 'Event' | 'User' | 'all'
  // Actions users can perform on subjects
  Action: PermissionsBase['Action'] // use defaults ("edit" | "read" | "delete" | "create" | "manage")
} & PermissionsBase

// export const testPermissions: Permissions<PermissionsTypes> = {
//   Public({ can: allow, cannot: forbid }) {
//     // No permissions
//   },
//   Admin({ can: allow, cannot: forbid }) {
//     // Can do everything
//     allow('manage', 'all')
//   },
//   User({ can: allow, cannot: forbid }, { userId }) {
//     // Read only access to Things
//     allow('read', 'Thing')
//     // Can edit their own user
//     allow('edit', 'User', { id: userId })
//   }
// }
