'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { OperatorSelect } from '@/components/OperatorSelect'
import { selectFilter } from '@/components/selectFilter'
import { Role } from '@/services/auth/permissions'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTitle } from '@/utils/useTitle'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Space, TableColumnsType, Tag } from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import { RoleTag } from './RoleTag'
import { usersFetcher } from './usersFetcher'

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
    filterDropdown: selectFilter(OperatorSelect),
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
