'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { operatorsFetcher } from './operatorsFetcher'
import Link from 'next/link'
import { selectFilter } from '@/components/selectFilter'
import { RegionSelect } from '@/components/RegionSelect'

type Row = Awaited<ReturnType<typeof operatorsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ id, name }) => <Link href={`/operators/${id}`}>{name}</Link>
  },
  {
    title: 'Region',
    key: 'region',
    render: ({ regionColor, region }) => (
      <Tag color={regionColor}>{region}</Tag>
    ),
    filterDropdown: selectFilter(RegionSelect)
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }

  // {
  //   render: ({ id }: { id: string }) => (
  //     <Link href={`/operators/${id}`}>
  //       <Button size="small">Open</Button>
  //     </Link>
  //   )
  // }
]

export const OperatorList = () => {
  useAssertAbility({ read: 'Operator' })
  return (
    <AdminTable
      fetcher={operatorsFetcher}
      swrKey="operators"
      columns={columns}
    />
  )
}
