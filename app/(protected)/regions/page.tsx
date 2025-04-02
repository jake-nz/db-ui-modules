'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Globe from '@/components/icons/globe.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon from '@ant-design/icons'
import { Space, TableColumnsType, Tag } from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import { regionsFetcher } from './regionsFetcher'
import { useTitle } from '@/utils/useTitle'

type Row = Awaited<ReturnType<typeof regionsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ id, color, name }) => (
      <Link href={`/regions/${id}`}>
        <Tag color={color}>{name}</Tag>
      </Link>
    )
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export default function Regions() {
  useTitle('Regions')
  useAssertAbility({ read: 'Operator' })
  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <Icon component={Globe} />
                <span>Regions</span>
              </Space>
            )
          }
        ]}
      />
      <AdminTable fetcher={regionsFetcher} swrKey="regions" columns={columns} />
    </>
  )
}
