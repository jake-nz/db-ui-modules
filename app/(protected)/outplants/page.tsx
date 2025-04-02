'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { dateFormat, Datetime } from '@/components/Datetime'
import CoralIcon from '@/components/icons/coral.svg'
import { OperatorFilter } from '@/components/OperatorFilter'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon, { PlusOutlined } from '@ant-design/icons'
import { Button, Space, TableColumnsType, Tag } from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import { outplantDaysFetcher } from './outplantDaysFetcher'
import { useTitle } from '@/utils/useTitle'

type Row = Awaited<ReturnType<typeof outplantDaysFetcher>>[number]

const columns: TableColumnsType<Row> = [
  // Phase
  {
    title: 'Date',
    key: 'date',
    render: ({ date, id }) => (
      <Link href={`/outplants/${id}`}>{dateFormat(date)}</Link>
    ),
    sorter: true
  },
  {
    title: 'Region',
    key: 'region',
    render: ({ regionColor, region }) => <Tag color={regionColor}>{region}</Tag>
  },
  {
    title: 'Operator',
    dataIndex: 'operator',
    key: 'operator',
    filterDropdown: OperatorFilter
  },
  { title: 'Reef', dataIndex: 'reef', key: 'reef' },
  { title: 'Site', dataIndex: 'site', key: 'site' },
  {
    title: 'Outplants',
    dataIndex: 'outplantCount',
    key: 'outplantCount',
    width: 100
  }
]

export default function Outplants() {
  useTitle('Outplants')
  useAssertAbility({ read: 'Operator' })
  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <Icon component={CoralIcon} />
                <span>Outplants</span>
              </Space>
            )
          }
        ]}
        extra={
          <Link href="/outplants/create">
            <Button type="primary" icon={<Icon component={CoralIcon} />}>
              Enter Outplants
            </Button>
          </Link>
        }
      />
      <AdminTable
        fetcher={outplantDaysFetcher}
        swrKey="outplantDays"
        columns={columns}
        defaultSorter={[{ columnKey: 'date', order: 'descend' }]}
      />
    </>
  )
}
