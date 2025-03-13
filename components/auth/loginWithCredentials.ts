'use server'
import { signIn } from '@/auth/auth'
import { CredentialsSignin } from 'next-auth'
import { redirect } from 'next/navigation'

export const loginWithCredentials = async (
  username: string,
  password: string
) => {
  try {
    console.log('###############A')
    const r = await signIn('credentials', { username, password })
    console.log('###############')
    console.log(r)
    console.log('###############/')
    return r
  } catch (e) {
    if (e instanceof CredentialsSignin) {
      console.error(e)
      return { error: 'Invalid user or password' }
    }
    if (e instanceof redirect) console.log(e)
    console.log(e)
    throw e
  }
}
