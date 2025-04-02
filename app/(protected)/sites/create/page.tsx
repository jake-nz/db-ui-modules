'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiteFields, SiteForm } from '../SiteForm'
import { createSite } from './createSite'

export default function CreateSite() {
  useAssertAbility({ create: 'Site' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: SiteFields) => {
      const id = await createSite(values)
      push(`/sites/${id}`)
    },
    start: { message: 'Creating site' },
    success: id => ({
      message: 'Created site',
      actions: (
        <Link href={`/sites/${id}`}>
          <Button type="primary">View</Button>
        </Link>
      )
    }),
    error: { message: 'Error creating site' }
  })

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: '/sites',
            title: (
              <Space>
                <TeamOutlined />
                <span>Sites</span>
              </Space>
            )
          },
          { title: 'New Site' }
        ]}
      />
      <Card
        title={
          <>
            <PlusOutlined /> New Site
          </>
        }
        variant="borderless"
      >
        <SiteForm onFinish={create} buttonText="Create Site" />
      </Card>
      {notificationContext}
    </>
  )
}
