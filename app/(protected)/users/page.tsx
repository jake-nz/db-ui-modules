'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { Button, Space, TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { usersFetcher } from './usersFetcher'
import { RoleTag } from './RoleTag'
import { Role } from '@/services/auth/permissions'
import Link from 'next/link'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { OperatorFilter } from '@/components/OperatorFilter'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useTitle } from '@/utils/useTitle'

type Row = Awaited<ReturnType<typeof usersFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ id, name }) => <Link href={`/users/${id}`}>{name}</Link>
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email'
  },
  {
    title: 'Operator',
    key: 'operatorName',
    dataIndex: 'operatorName',
    filterDropdown: OperatorFilter,
    render: (operatorName: string) =>
      operatorName || <Tag color="green">All</Tag>
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role: Role) => <RoleTag role={role} />
  }
]

export default function Users() {
  useTitle('Users')
  useAssertAbility({ read: 'User' })
  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <UserOutlined />
                <span>Users</span>
              </Space>
            )
          }
        ]}
        extra={
          <Link href="/users/create">
            <Button size="small" icon={<UserAddOutlined />}>
              New User
            </Button>
          </Link>
        }
      />
      <AdminTable fetcher={usersFetcher} swrKey="users" columns={columns} />
    </>
  )
}
