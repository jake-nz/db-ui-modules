import { AntdRegistry } from '@ant-design/nextjs-registry'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coral Nurture'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
