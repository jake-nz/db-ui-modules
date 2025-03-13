'use server'
import { signIn } from '../auth'
import { CredentialsSignin } from 'next-auth'

export const signinWithCredentials = async (
  username: string,
  password: string
) => {
  try {
    await signIn('credentials', {
      redirect: false,
      username,
      password
    })
    return { success: true }
  } catch (e) {
    if (e instanceof CredentialsSignin)
      return { error: 'Invalid user or password' }

    throw e
  }
}
