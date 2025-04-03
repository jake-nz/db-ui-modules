'use server'
import { config } from '@/config'
import { assertUserAbility } from '@/services/auth/ability'
import { Role } from '@/services/auth/permissions'
import { database } from '@/services/database/database'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(config.RESEND_API_KEY)

type NewUserFields = {
  name: string
  email: string
  role: Role
  operatorId?: string
}

export const createUser = async (values: NewUserFields, baseUrl: string) => {
  await assertUserAbility({ create: 'User' })

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now

  const { id } = await database
    .insertInto('users')
    .values({
      name: values.name,
      email: values.email,
      role: values.role,
      operatorId: values.operatorId,
      password: '',
      resetToken,
      resetTokenExpiresAt
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  // Create the reset URL
  const resetUrl = `${baseUrl}auth/reset-password?token=${resetToken}`

  // Send the email
  await resend.emails.send({
    from: config.EMAIL_FROM,
    to: `${values.name}<${values.email}>`,
    subject: 'Coral Nurture Program - Database Access',
    html: `
       <div>
         <h1>Coral Nurture Program - Database Access</h1>
         <p>You have been granted access to the Coral Nurture Program database.</p>
         <p>Please click the link below to login:</p>
         <p><a href="${resetUrl}">Reset Password</a></p>
         <p>This link will expire in 1 week.</p>
       </div>
     `
  })

  return id
}
