'use client'
import { useAssertAbility } from '@/auth/ability'
import { Datetime } from '@/components/Datetime'
import { OriginTag } from '@/components/OriginTag'
import { Button, Space, TableColumnsType, Tag, Typography } from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import { outplantsFetcher } from './outplantsFetcher'

const { Text } = Typography

type Row = Awaited<ReturnType<typeof outplantsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  // Phase
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: date => <Datetime>{date}</Datetime>
  },
  {
    title: 'Region',
    key: 'region',
    render: ({ regionColor, region }) => <Tag color={regionColor}>{region}</Tag>
  },
  { title: 'Operator', dataIndex: 'operator', key: 'operator' },
  { title: 'Reef', dataIndex: 'reef', key: 'reef' },
  { title: 'Site', dataIndex: 'site', key: 'site' },
  {
    title: 'Species',
    key: 'species',
    render: ({ species, genus }) => (
      <i>
        {genus} {species}
      </i>
    )
  },
  { title: 'Morph', dataIndex: 'morph', key: 'morph' },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    width: 80
  },
  {
    title: 'Origin',
    dataIndex: 'origin',
    key: 'origin',
    render: origin => <OriginTag origin={origin} />
  },
  { title: 'Notes', dataIndex: 'notes', key: 'notes' }
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
      />
    </Space>
  )
}
