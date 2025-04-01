'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, notification, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReefForm } from '../ReefForm'
import { createReef, NewReefFields } from './createReef'

export default function CreateReef() {
  useAssertAbility({ create: 'Reef' })

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  const create = async (values: NewReefFields) => {
    notifications.info({
      message: `Creating ${values.name}`,
      key: 'create-reef',
      closable: false
    })

    try {
      const id = await createReef(values)
      notifications.success({
        message: `Created ${values.name}`,
        actions: (
          <Link href={`/reefs/${id}`}>
            <Button type="primary">View</Button>
          </Link>
        ),
        key: 'create-reef'
      })

      push(`/reefs/${id}`)
    } catch (err) {
      console.error(err)
      const getMessage = (err: any) => {
        if (err instanceof Error) {
          return err.message
        }
        if (typeof err === 'string') {
          return err
        }
        return 'Unknown error'
      }

      notifications.error({
        message: `Error creating ${values.name}`,
        description: getMessage(err),
        key: 'create-reef',
        duration: 0
      })
    }
  }

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
        <ReefForm<NewReefFields> onFinish={create} buttonText="Create Reef" />
      </Card>
      {notificationContext}
    </>
  )
}
