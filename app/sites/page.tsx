'use client'
import { useAssertAbility } from '@/auth/ability'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { sitesFetcher } from './sitesFetcher'

type Row = Awaited<ReturnType<typeof sitesFetcher>>[number]

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
    <AdminTable fetcher={sitesFetcher} swrKey="regions" columns={columns} />
  )
}
