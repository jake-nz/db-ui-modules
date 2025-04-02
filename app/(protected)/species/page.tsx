'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Space, Button } from 'antd'
import { AdminTable } from 'snaks/client'
import { speciesFetcher } from './speciesFetcher'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { NodeExpandOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useTitle } from '@/utils/useTitle'

type Row = Awaited<ReturnType<typeof speciesFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Genus',
    key: 'genus',
    render: ({ id, genus }) => <Link href={`/species/${id}`}>{genus}</Link>
  },
  {
    title: 'Species',
    key: 'species',
    render: ({ id, species }) => <Link href={`/species/${id}`}>{species}</Link>
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export default function Species() {
  useTitle('Species')
  const { can } = useAssertAbility({ read: 'Species' })
  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <NodeExpandOutlined />
                <span>Species</span>
              </Space>
            )
          }
        ]}
        extra={
          can('create', 'Species') && (
            <Link href="/species/create">
              <Button size="small" icon={<PlusOutlined />}>
                New Species
              </Button>
            </Link>
          )
        }
      />
      <AdminTable
        fetcher={speciesFetcher}
        swrKey="species"
        columns={columns}
        pagination={{ pageSize: 100 }}
      />
    </>
  )
}
