import { Space } from 'antd'
import Image from 'next/image'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{
        width: '100%',
        // Less than full height to ballance content towards top
        minHeight: '70vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Image
        src="/images/logo-dark.png"
        width={1609 / 7}
        height={1154 / 7}
        alt="logo"
        priority
      />
      {children}
    </Space>
  )
}
