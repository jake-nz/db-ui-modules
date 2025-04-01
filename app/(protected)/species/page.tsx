'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType } from 'antd'
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

export default function Species() {
  useAssertAbility({ read: 'Species' })
  return (
    <AdminTable fetcher={speciesFetcher} swrKey="species" columns={columns} />
  )
}
