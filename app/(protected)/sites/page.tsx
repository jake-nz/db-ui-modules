'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Tag, Space } from 'antd'
import { AdminTable } from 'snaks/client'
import { sitesFetcher } from './sitesFetcher'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import MapPin from '@/components/icons/map-pin-line.svg'
import Icon from '@ant-design/icons'

type Row = Awaited<ReturnType<typeof sitesFetcher>>[number]

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

export default function Sites() {
  useAssertAbility({ read: 'Operator' })
  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <Icon component={MapPin} />
                <span>Sites</span>
              </Space>
            )
          }
        ]}
      />
      <AdminTable fetcher={sitesFetcher} swrKey="sites" columns={columns} />
    </>
  )
}
