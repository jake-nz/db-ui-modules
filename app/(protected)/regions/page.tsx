'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Globe from '@/components/icons/globe.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon from '@ant-design/icons'
import { Space, TableColumnsType, Tag } from 'antd'
import { AdminTable } from 'snaks/client'
import { regionsFetcher } from './regionsFetcher'

type Row = Awaited<ReturnType<typeof regionsFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ color, name }) => <Tag color={color}>{name}</Tag>
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export default function Regions() {
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
