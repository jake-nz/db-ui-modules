'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Space, Button } from 'antd'
import { AdminTable } from 'snaks/client'
import { sitesFetcher } from './sitesFetcher'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import MapPin from '@/components/icons/map-pin-line.svg'
import Icon, { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'

type Row = Awaited<ReturnType<typeof sitesFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ id, name }) => <Link href={`/sites/${id}`}>{name}</Link>
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export default function Sites() {
  const { can } = useAssertAbility({ read: 'Operator' })
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
        extra={
          can('create', 'Site') && (
            <Link href="/sites/create">
              <Button size="small" icon={<PlusOutlined />}>
                New Site
              </Button>
            </Link>
          )
        }
      />
      <AdminTable fetcher={sitesFetcher} swrKey="sites" columns={columns} />
    </>
  )
}
