import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth/auth'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Prepopulate SessionProvider to avoid loading state on client
  const session = await auth()
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <SessionProvider session={session}>{children}</SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
