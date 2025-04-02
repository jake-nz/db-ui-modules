'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { dateFormat } from '@/components/Datetime'
import CoralIcon from '@/components/icons/coral.svg'
import { OperatorSelect } from '@/components/OperatorSelect'
import { ReefSelect } from '@/components/ReefSelect'
import { RegionSelect } from '@/components/RegionSelect'
import { selectFilter } from '@/components/selectFilter'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTitle } from '@/utils/useTitle'
import Icon from '@ant-design/icons'
import { Button, Space, TableColumnsType, Tag } from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import { outplantDaysFetcher } from './outplantDaysFetcher'

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
    render: ({ regionColor, region }) => (
      <Tag color={regionColor}>{region}</Tag>
    ),
    filterDropdown: selectFilter(RegionSelect)
  },
  {
    title: 'Operator',
    dataIndex: 'operator',
    key: 'operator',
    filterDropdown: selectFilter(OperatorSelect)
  },
  {
    title: 'Reef',
    dataIndex: 'reef',
    key: 'reef',
    filterDropdown: selectFilter(ReefSelect)
  },
  {
    title: 'Site',
    dataIndex: 'site',
    key: 'site'
  },
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
