# Auth

- Expects the project to export a Kysely DB instance at `@database`
- Expects the database to have a `users` table with columns `id`, `name`, `email`, `password`, `resetToken`, `resetTokenExpiresAt`
- Expects the project to export a `getUser` function at `@/services/auth/getUser`
