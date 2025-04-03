import { Stats } from '@/components/Stats/Stats'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Coral Nurture Program Database'
}

export default function Home() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', alignItems: 'center' }}
    >
      <Image
        src="/images/logo-dark.png"
        width={1609 / 7}
        height={1154 / 7}
        alt="logo"
        priority
      />
      <Stats />
      <Link href="/outplants/create">
        <Button type="primary" icon={<PlusOutlined />}>
          Enter Outplants
        </Button>
      </Link>
    </Space>
  )
}
