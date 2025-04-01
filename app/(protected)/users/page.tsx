'use client'
import { useAssertAbility } from '@/services/auth/ability'
import { Button, Space, TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { usersFetcher } from './usersFetcher'
import { RoleTag } from './RoleTag'
import { Role } from '@/services/auth/permissions'
import Link from 'next/link'
import { UserAddOutlined } from '@ant-design/icons'
import { OperatorFilter } from '@/components/OperatorFilter'

type Row = Awaited<ReturnType<typeof usersFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name'
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
  useAssertAbility({ read: 'User' })
  return (
    <Space direction="vertical" size="large" align="end">
      <Link href="/users/create">
        <Button icon={<UserAddOutlined />}>Add User</Button>
      </Link>
      <AdminTable fetcher={usersFetcher} swrKey="users" columns={columns} />
    </Space>
  )
}
