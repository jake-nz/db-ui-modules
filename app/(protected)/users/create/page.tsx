'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getURL } from '@/services/auth/getURL'
import { useAssertAbility } from '@/services/auth/useAbility'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, notification, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserForm } from '../UserForm'
import { createUser, NewUserFields } from './createUser'

export default function CreateUser() {
  useAssertAbility({ create: 'User' })

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  const create = async (values: NewUserFields) => {
    notifications.info({
      message: `Creating ${values.name}`,
      key: 'create-user',
      closable: false
    })

    try {
      const baseUrl = getURL()
      const id = await createUser(values, baseUrl)
      notifications.success({
        message: `Created ${values.name}`,
        actions: (
          <Link href={`/users/${id}`}>
            <Button type="primary">View</Button>
          </Link>
        ),
        key: 'create-user'
      })

      push(`/users/${id}`)
    } catch (err) {
      console.error(err)
      const getMessage = (err: any) => {
        if (err instanceof Error) {
          if (err.message.includes('users_email_key'))
            return 'A user with this email already exists'
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
        key: 'create-user',
        duration: 0
      })
    }
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: '/users',
            title: (
              <Space>
                <UserOutlined />
                <span>Users</span>
              </Space>
            )
          },
          { title: 'New User' }
        ]}
      />
      <Card
        title={
          <>
            <UserAddOutlined /> New User
          </>
        }
        variant="borderless"
      >
        <UserForm<NewUserFields> onFinish={create} buttonText="Create User" />
      </Card>
      {notificationContext}
    </>
  )
}
