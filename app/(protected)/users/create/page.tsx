'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getURL } from '@/services/auth/getURL'
import { useAssertAbility } from '@/services/auth/useAbility'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserForm } from '../UserForm'
import { createUser, NewUserFields } from './createUser'
import { useTryNotify } from '@/utils/useTryNotify.ts'

export default function CreateUser() {
  useAssertAbility({ create: 'User' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: NewUserFields) => {
      const baseUrl = getURL()
      const id = await createUser(values, baseUrl)
      push(`/users/${id}`)
    },
    start: { message: 'Creating user' },
    success: id => ({
      message: 'Created user',
      actions: (
        <Link href={`/users/${id}`}>
          <Button type="primary">View</Button>
        </Link>
      )
    }),
    error: { message: 'Error creating user' }
  })

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
