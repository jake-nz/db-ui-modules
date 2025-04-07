import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { AuthProvider } from '@/modules/auth/components/SessionProvider'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AuthProvider>{children}</AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
