'use client'
import { useAssertAbility } from '@/services/auth/ability'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { operatorsFetcher } from './operatorsFetcher'

type Row = Awaited<ReturnType<typeof operatorsFetcher>>[number]

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
