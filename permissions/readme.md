# Castellate

Multi-tenant capable permissions for CASL

## Usage

```ts
import { Permissions, CastellateBase } from 'castellate'

// Define types
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
  Action: CastellateBase['Action'] // use defaults ("edit" | "read" | "delete" | "create" | "manage")
} & CastellateBase

// Define permissions
export const permissions: Permissions<PermissionsTypes> = {
  Public({ can: allow, cannot: forbid }) {
    // No permissions
  },
  Admin({ can: allow, cannot: forbid }) {
    // Can do everything
    allow('manage', 'all')
  },
  User({ can: allow, cannot: forbid }, { userId }) {
    // Read only access to Things
    allow('read', 'Thing')
    // Can edit their own user
    allow('edit', 'User', { id: userId })
  }
}
```

## `defineAbilityForRoles`

```ts
const myRoles = [
  { tenantId: 'Client-A', role: 'Admin' },
  { tenantId: 'Client-B', role: 'User' }
]

const myAbility = defineAbilityForRoles(myRoles, permissions)
```

## `assertAbilityRequirements`

```ts
// Assert can edit Things
assertAbilityRequirements(myAbility, { edit: 'Thing' })

// Assert can edit a specific Thing
assertAbilityRequirements(myAbility, { edit: { Thing: { id: 1 } } })

// Assert can edit Things for Client-A
assertAbilityRequirements(myAbility, {
  edit: { Thing: { clientId: 'Client-A' } }
})

// Assert can edit Things and Events
assertAbilityRequirements(myAbility, { edit: ['Thing', 'Event'] })
```

## `destructurableAbility`

```ts
// Does't work!
const useAbility = () => someAbility
const { can, cannot } = useAbility()
can('edit', 'Thing') // Error!

// Works with destructurable ability
const useAbility = () => destructurableAbility(someAbility)
const { can, cannot } = useAbility()
can('edit', 'Thing') // true
```
