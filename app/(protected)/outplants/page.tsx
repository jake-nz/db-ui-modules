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
import Icon, { CalendarOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  Button,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Typography
} from 'antd'
import Link from 'next/link'
import { AdminTable } from 'snaks/client'
import {
  outplantDaysFetcher,
  outplantDaysSummaryFetcher
} from './outplantDaysFetcher'
import { DateRangeFilter } from '@/components/DateRangeFilter'
import useSWR from 'swr'
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import { FilterValue } from 'antd/es/table/interface'

const { Text } = Typography

type Row = Awaited<ReturnType<typeof outplantDaysFetcher>>[number]

const columns: TableColumnsType<Row> = [
  // Phase
  {
    title: 'Date',
    key: 'date',
    render: ({ date, id }) => (
      <Link href={`/outplants/${id}`}>{dateFormat(date)}</Link>
    ),
    sorter: true,
    filterDropdown: DateRangeFilter,
    filterIcon: (filtered: boolean) => (
      <CalendarOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    )
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
    key: 'outplantCount',
    width: 100,
    render: ({ outplantCount, id }) => (
      <Link href={`/outplants/${id}`}>{outplantCount}</Link>
    )
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
        summary={pageData => <Summary />}
      />
    </>
  )
}

const getFilters = (urlQuery: ReadonlyURLSearchParams | null) => {
  if (!urlQuery) return null

  const filters: Record<string, FilterValue | null> = {}

  for (const key of urlQuery.keys()) {
    if (key === 'page') continue
    if (key === 'sort') continue

    const filter = urlQuery.getAll(key)
    if (!filter) continue

    filters[key] = filter
  }

  if (!Object.keys(filters).length) return null

  return filters
}

const Summary = () => {
  const urlQuery = useSearchParams()
  const filters = getFilters(urlQuery)
  const { data } = useSWR(
    { filters: { ...filters }, swrKey: 'outplants-summary' },
    outplantDaysSummaryFetcher
  )
  if (!data)
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={6}>
          <Spin indicator={<LoadingOutlined spin />} size="small" />
        </Table.Summary.Cell>
      </Table.Summary.Row>
    )

  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}>
        <Text strong>{data.dateCount} Days</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={0}>
        <Text strong>{data.regionCount} Regions</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={0}>
        <Text strong>{data.operatorCount} Operators</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={0}>
        <Text strong>{data.reefCount} Reefs</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={0}>
        <Text strong>{data.siteCount} Sites</Text>
      </Table.Summary.Cell>
      <Table.Summary.Cell index={0}>
        <Text strong>{data.totalOutplants} Outplants</Text>
      </Table.Summary.Cell>
    </Table.Summary.Row>
  )
}
