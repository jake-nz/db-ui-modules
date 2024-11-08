import { signIn, auth } from '@/auth/auth'

export default async function SignIn() {
  const session = await auth()
  return (
    <form
      action={async formData => {
        'use server'
        await signIn('credentials', formData)
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </form>
  )
}
