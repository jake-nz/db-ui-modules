'use client'
import { useAssertAbility } from '@/auth/ability'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { regionsFetcher } from './regionsFetcher'

type Row = Awaited<ReturnType<typeof regionsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ color, name }) => <Tag color={color}>{name}</Tag>
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export default function Operators() {
  useAssertAbility({ read: 'Operator' })
  return (
    <AdminTable fetcher={regionsFetcher} swrKey="regions" columns={columns} />
  )
}
