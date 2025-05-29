- Setup `git remote add modules ~/dev/modules`
- Add: `git subtree add --prefix=modules modules main`
- Pull: `git subtree pull --prefix=modules modules main`
- Push: `git subtree push --prefix=modules modules main`

If the subtree remote is on main you can't push to it so check out the latest commit instead:

```sh
git checkout `git rev-parse main`
```

# Auth

- Expects the project to export a Kysely DB instance at `@database`
- Expects the database to have a `users` table with columns `id`, `name`, `email`, `password`, `resetToken`, `resetTokenExpiresAt`
- Expects the project to export a `getUser` function at `@/services/auth/getUser`

# Utils

## useTitle

- `NEXT_PUBLIC_TITLE_PREFIX` & `NEXT_PUBLIC_TITLE_SUFFIX` are used to prefix and suffix the title
