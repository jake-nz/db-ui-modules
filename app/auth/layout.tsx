import { AuthLayout } from '@/modules/auth/components/AuthLayout'
import Image from 'next/image'

export default async function AuthLayoutWithLogo({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      <Image
        src="/images/logo-dark.png"
        width={1609 / 7}
        height={1154 / 7}
        alt="logo"
        priority
      />
      {children}
    </AuthLayout>
  )
}
