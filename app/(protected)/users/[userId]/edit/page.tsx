'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { UserOutlined } from '@ant-design/icons'
import { Card, Skeleton, Space } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { UserFields, UserForm } from '../../UserForm'
import { userFetcher } from '../userFetcher'
import { editUser } from './editUser'
import { useTitle } from '@/utils/useTitle'

export default function EditUser() {
  const { userId } = useParams()
  if (Array.isArray(userId)) throw new Error('Multiple userIds')

  useAssertAbility({ edit: { User: { id: userId } } })

  const { data, error, isLoading } = useSWR({ userId }, userFetcher)

  useTitle(`Edit ${data?.name || 'User'}`)

  const { push } = useRouter()

  const [save, notificationContext] = useTryNotify({
    action: async (values: UserFields) => {
      await editUser(userId, values)
      push(`/users/${userId}`)
    },
    start: { message: 'Saving user' },
    success: { message: 'Saved user' },
    error: { message: 'Error saving user' }
  })

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

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
          {
            href: `/users/${userId}`,
            title: data.name
          },
          { title: 'Edit' }
        ]}
      />
      <Card
        title={
          <>
            <UserOutlined /> Edit {data.name}
          </>
        }
        variant="borderless"
      >
        <UserForm onFinish={save} initialValues={data} buttonText="Save User" />
      </Card>
      {notificationContext}
    </>
  )
}
