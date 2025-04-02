'use client'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TableColumnsType, Space, Button } from 'antd'
import { AdminTable } from 'snaks/client'
import { sitesFetcher } from './sitesFetcher'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import MapPin from '@/components/icons/map-pin-line.svg'
import Icon, { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useTitle } from '@/utils/useTitle'
import { selectFilter } from '@/components/selectFilter'
import { ReefSelect } from '@/components/ReefSelect'

type Row = Awaited<ReturnType<typeof sitesFetcher>>[number]

const columns: TableColumnsType<Row> = [
  {
    title: 'Name',
    key: 'name',
    render: ({ id, name }) => <Link href={`/sites/${id}`}>{name}</Link>
  },
  {
    title: 'Reef',
    dataIndex: 'reef',
    key: 'reef',
    filterDropdown: selectFilter(ReefSelect)
  },
  {
    title: 'Outplants',
    dataIndex: 'totalOutplants',
    key: 'totalOutplants'
  }
]

export default function Sites() {
  useTitle('Sites')
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
