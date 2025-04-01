'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { reefsFetcher } from './reefsFetcher'

type Row = Awaited<ReturnType<typeof reefsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Region',
    key: 'region',
    render: ({ color, region }) => <Tag color={color}>{region}</Tag>
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export const ReefList = () => {
  useAssertAbility({ read: 'Reef' })
  return (
    <AdminTable
      fetcher={reefsFetcher}
      swrKey="reefs"
      columns={columns}
    />
  )
}
