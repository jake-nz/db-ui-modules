'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { reefsFetcher } from './reefsFetcher'
import Link from 'next/link'
import { selectFilter } from '@/components/selectFilter'
import { RegionSelect } from '@/components/RegionSelect'

type Row = Awaited<ReturnType<typeof reefsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ id, name }) => <Link href={`/reefs/${id}`}>{name}</Link>
  },
  {
    title: 'Region',
    key: 'region',
    render: ({ color, region }) => <Tag color={color}>{region}</Tag>,
    filterDropdown: selectFilter(RegionSelect)
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export const ReefList = () => {
  useAssertAbility({ read: 'Reef' })
  return <AdminTable fetcher={reefsFetcher} swrKey="reefs" columns={columns} />
}
