'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getURL } from '@/services/auth/getURL'
import { useAssertAbility } from '@/services/auth/useAbility'
import { UserOutlined } from '@ant-design/icons'
import { Button, Card, Modal, notification, Skeleton, Space } from 'antd'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { UserForm } from '../../UserForm'
import { userFetcher } from '../userFetcher'
import { editUser, UserFields } from './editUser'

export default function EditUser() {
  const { userId } = useParams()
  if (Array.isArray(userId)) throw new Error('Multiple userIds')

  useAssertAbility({ edit: { User: { id: userId } } })

  const { data, error, isLoading } = useSWR(userId, userFetcher)

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

  const save = async (values: UserFields) => {
    notifications.info({
      message: `Saving ${values.name}`,
      key: 'save-user',
      closable: false
    })

    try {
      await editUser(userId, values)
      notifications.success({
        message: `Saved ${values.name}`,
        key: 'save-user'
      })

      push(`/users/${userId}`)
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
        message: `Error saving ${values.name}`,
        description: getMessage(err),
        key: 'save-user',
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
        <UserForm<UserFields>
          onFinish={save}
          initialValues={data}
          buttonText="Save User"
        />
      </Card>
      {notificationContext}
    </>
  )
}
