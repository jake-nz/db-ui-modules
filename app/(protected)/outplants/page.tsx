'use client'
import { Datetime } from '@/components/Datetime'
import { OperatorFilter } from '@/components/OperatorFilter'
import { useAssertAbility } from '@/services/auth/useAbility'
import { Button, Space, TableColumnsType, Tag } from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import { outplantsFetcher } from './outplantsFetcher'

type Row = Awaited<ReturnType<typeof outplantsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  // Phase
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: date => <Datetime>{date}</Datetime>,
    sorter: true
  },
  {
    title: 'Region',
    key: 'region',
    render: ({ regionColor, region }) => <Tag color={regionColor}>{region}</Tag>
  },
  {
    title: 'Operator',
    dataIndex: 'operator',
    key: 'operator',
    filterDropdown: OperatorFilter
  },
  { title: 'Reef', dataIndex: 'reef', key: 'reef' },
  { title: 'Site', dataIndex: 'site', key: 'site' },
  {
    title: 'Outplants',
    dataIndex: 'outplantCount',
    key: 'outplantCount',
    width: 100
  }
]

export default function Outplants() {
  useAssertAbility({ read: 'Operator' })
  return (
    <Space direction="vertical" size="large">
      <Link href="/outplants/create">
        <Button type="primary">Enter Outplants</Button>
      </Link>
      <AdminTable
        fetcher={outplantsFetcher}
        swrKey="outplants"
        columns={columns}
        defaultSorter={[{ columnKey: 'date', order: 'descend' }]}
      />
    </Space>
  )
}
