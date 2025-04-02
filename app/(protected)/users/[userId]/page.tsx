'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Details } from '@/components/Details'
import { Id } from '@/components/Id'
import { useAssertAbility } from '@/services/auth/useAbility'
import { FormOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Skeleton, Space } from 'antd'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { RoleTag } from '../RoleTag'
import { userFetcher } from './userFetcher'
import { useTitle } from '@/utils/useTitle'

export default function User() {
  const { userId } = useParams()
  if (Array.isArray(userId)) throw new Error('Multiple userIds')

  const { can } = useAssertAbility({ read: { User: { id: userId } } })

  const { data, error, isLoading } = useSWR({ userId }, userFetcher)

  useTitle(data?.name || 'User')

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
            title: data.name
          }
        ]}
      />
      <Card
        title={
          <>
            <UserOutlined /> {data.name}
          </>
        }
        variant="borderless"
        extra={
          can('edit', 'User') && (
            <Space>
              <Link href={`/users/${data.id}/edit`}>
                <Button size="small" icon={<FormOutlined />}>
                  Edit
                </Button>
              </Link>
              {/* <Button size="small" icon={<DeleteOutlined />} danger>
            Delete
          </Button> */}
            </Space>
          )
        }
      >
        <Details
          details={{
            ID: <Id>{data.id}</Id>,
            Name: data.name,
            Email: data.email,
            Role: <RoleTag role={data.role} />,
            Operator: data.operatorName ? (
              <Link href={`/operators/${data.operatorId}`}>
                {data.operatorName}
              </Link>
            ) : (
              'All'
            )
          }}
        />
      </Card>
    </>
  )
}
