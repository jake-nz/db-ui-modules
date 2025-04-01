'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { operatorsFetcher } from './operatorsFetcher'
import Link from 'next/link'

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
    render: ({ color, region }) => <Tag color={color}>{region}</Tag>
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
