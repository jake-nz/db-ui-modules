'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReefFields, ReefForm } from '../ReefForm'
import { createReef } from './createReef'

export default function CreateReef() {
  useAssertAbility({ create: 'Reef' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: ReefFields) => {
      const id = await createReef(values)
      push(`/reefs/${id}`)
    },
    start: { message: 'Creating reef' },
    success: id => ({
      message: 'Created reef',
      actions: (
        <Link href={`/reefs/${id}`}>
          <Button type="primary">View</Button>
        </Link>
      )
    }),
    error: { message: 'Error creating reef' }
  })

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: '/reefs',
            title: (
              <Space>
                <TeamOutlined />
                <span>Reefs</span>
              </Space>
            )
          },
          { title: 'New Reef' }
        ]}
      />
      <Card
        title={
          <>
            <PlusOutlined /> New Reef
          </>
        }
        variant="borderless"
      >
        <ReefForm onFinish={create} buttonText="Create Reef" />
      </Card>
      {notificationContext}
    </>
  )
}
