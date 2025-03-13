'use server'
import { database } from '@/services/database/database'
import { Resend } from 'resend'
import crypto from 'crypto'
import { config } from '@/config'

const resend = new Resend(config.RESEND_API_KEY)

export const forgotPassword = async ({
  email,
  redirectTo
}: {
  email: string
  redirectTo: string
}) => {
  // Find the user
  const user = await database
    .selectFrom('users')
    .select(['id', 'email', 'name'])
    .where('email', '=', email)
    .executeTakeFirst()

  // Don't reveal if the email exists or not for security reasons
  if (!user) return { success: true }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiresAt = new Date(Date.now() + 3600000) // 1 hour from now

  // Store the token in the database
  await database
    .updateTable('users')
    .set({
      resetToken,
      resetTokenExpiresAt
    })
    .where('id', '=', user.id)
    .execute()

  // Create the reset URL
  const resetUrl = `${redirectTo}?token=${resetToken}`

  // Send the email
  await resend.emails.send({
    from: config.EMAIL_FROM,
    to: `${user.name}<${user.email}>`,
    subject: 'Reset Your Password',
    html: `
      <div>
        <h1>Reset Your Password</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  })

  return { success: true }
}
