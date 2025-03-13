import { z } from 'zod'

export const configSchema = z.object({
  DATABASE_URL: z.string(),
  EMAIL_FROM: z.string(),
  RESEND_API_KEY: z.string()
})

export type Config = z.infer<typeof configSchema>

export const config = configSchema.parse(process.env)
