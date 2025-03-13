'use client'
import { useAssertAbility } from '@/services/auth/ability'
import { TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { speciesFetcher } from './speciesFetcher'

type Row = Awaited<ReturnType<typeof speciesFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Genus',
    key: 'genus',
    dataIndex: 'genus'
  },
  {
    title: 'Species',
    key: 'species',
    dataIndex: 'species'
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
    <AdminTable fetcher={speciesFetcher} swrKey="regions" columns={columns} />
  )
}
