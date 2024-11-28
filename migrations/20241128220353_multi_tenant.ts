import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create an enum type for the user role
  await db.schema
    .createType('userRole')
    .asEnum(['Admin', 'Staff', 'Operator'])
    .execute()

  // Add roles and operatorId columns to the users table
  // defaulting to 'Admin' for existing
  await db.schema
    .alterTable('users')
    .addColumn('role', sql`user_role`, cb => cb.notNull().defaultTo('Admin'))
    .addColumn('operatorId', 'text', col => col.references('operators.id'))
    .execute()

  // Drop the default Staff role now all users have a role
  await db.schema
    .alterTable('users')
    .alterColumn('role', col => col.dropDefault())
    .execute()

  // Add a check constraint to ensure that the role is either global 'Admin', 'Staff', or single-tenant 'Operator'
  await db.schema
    .alterTable('users')
    .addCheckConstraint(
      'role_check',
      sql`(
	  	role in ('Admin', 'Staff') AND ${sql.ref('operatorId')} IS NULL)
		OR (role = 'Operator' AND ${sql.ref('operatorId')} IS NOT NULL)`
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('operatorId').execute()
  await db.schema.dropType('userRole').execute()
}
