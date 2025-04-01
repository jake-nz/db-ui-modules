'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, notification, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiteForm } from '../SiteForm'
import { createSite, NewSiteFields } from './createSite'

export default function CreateSite() {
  useAssertAbility({ create: 'Site' })

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  const create = async (values: NewSiteFields) => {
    notifications.info({
      message: `Creating ${values.name}`,
      key: 'create-site',
      closable: false
    })

    try {
      const id = await createSite(values)
      notifications.success({
        message: `Created ${values.name}`,
        actions: (
          <Link href={`/sites/${id}`}>
            <Button type="primary">View</Button>
          </Link>
        ),
        key: 'create-site'
      })

      push(`/sites/${id}`)
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
        key: 'create-site',
        duration: 0
      })
    }
  }

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
        <SiteForm<NewSiteFields> onFinish={create} buttonText="Create Site" />
      </Card>
      {notificationContext}
    </>
  )
}
