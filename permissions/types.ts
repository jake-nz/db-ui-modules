import { type AbilityBuilder, type ForcedSubject, type MongoAbility } from '@casl/ability'

export type PermissionsBase = {
  // How users are identified
  UserId: number | string
  // How tennants are identified (null = global role)
  Tenant: number | string | null
  // What roles a user could have
  Role: string // enum e.g. 'User' | 'Admin'
  // Subjects users could have roles for
  Subject: string | 'all'
  Action: 'list' | 'read' | 'edit' | 'delete' | 'create' | 'manage' // (manage = all)
}

// How we define the roles a user has per tenant
// EG
// [{ tenantId: 2, role: 'Staff' }] - Staff of tenant 2
// [{ tenantId: null, role: 'Admin' }] - Admin of all
export type Roles<Settings extends PermissionsBase> = {
  tenantId: Settings['Tenant']
  role: Settings['Role']
}[]

// A subject is a thing that a user can do something to
// EG 'User' or { 'Thing': { id: 2 } }
export type SubjectSpec<Settings extends PermissionsBase> =
  | Settings['Subject']
  | Partial<Record<Settings['Subject'], any>>

// EG { manage: 'Thing' }, { edit: ['Thing'] }, { read: { 'Thing': { id: 2 } } }
export type AbilityRequirements<Settings extends PermissionsBase> = Partial<
  Record<Settings['Action'], SubjectSpec<Settings> | SubjectSpec<Settings>[]>
>

export type AppAbility<Settings extends PermissionsBase> = MongoAbility<
  [Settings['Action'], Settings['Subject'] | ForcedSubject<Exclude<Settings['Subject'] | object, 'all'>>]
>

type DefinePermissions<Settings extends PermissionsBase> = (
  builder: AbilityBuilder<AppAbility<Settings>>,
  data: Partial<{ tenantId: Settings['Tenant']; userId: Settings['UserId'] }>
) => void

export type Permissions<Settings extends PermissionsBase> = Record<Settings['Role'], DefinePermissions<Settings>>
