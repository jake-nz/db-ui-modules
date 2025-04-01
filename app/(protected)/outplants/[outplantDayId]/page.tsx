'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Details } from '@/components/Details'
import { Id } from '@/components/Id'
import Coral from '@/components/icons/coral.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon, { FormOutlined, TeamOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Divider,
  Skeleton,
  Space,
  Tag,
  Typography,
  Table
} from 'antd'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { outplantDayFetcher } from './outplantDayFetcher'
import { Datetime } from '@/components/Datetime'
import { AdminTable } from 'snaks/client'
import { outplantDaysFetcher } from '../outplantDaysFetcher'
import { outplantsFetcher } from './outplantsFetcher'

const { Text } = Typography

export default function OutplantDay() {
  const { outplantDayId } = useParams()
  if (Array.isArray(outplantDayId)) throw new Error('Multiple outplantDayIds')

  const { can } = useAssertAbility({
    read: { Outplant: { id: outplantDayId } }
  })

  const { data, error, isLoading } = useSWR(outplantDayId, outplantDayFetcher)

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: '/outplants',
            title: (
              <Space>
                <Icon component={Coral} />
                <span>Outplants</span>
              </Space>
            )
          },
          {
            title: (
              <Space>
                <Text>
                  <Datetime>{data.date}</Datetime>,
                </Text>
                <Text>{data.operator},</Text>
                <Text>{data.site}</Text>
              </Space>
            )
          }
        ]}
      />
      <Card
        title={<Icon component={Coral} />}
        variant="borderless"
        extra={
          can('edit', 'Outplant') && (
            <Space>
              <Link href={`/outplants/${outplantDayId}/edit`}>
                <Button size="small" icon={<FormOutlined />}>
                  Edit
                </Button>
              </Link>
            </Space>
          )
        }
      >
        <Details
          details={{
            ID: <Id>{outplantDayId}</Id>,
            Date: <Datetime>{data.date}</Datetime>,
            Reef: (
              <Link href={`/reefs/${data.reefId}`}>
                <Space>
                  {data.reef}
                  <Tag color={data.regionColor}>{data.region}</Tag>
                </Space>
              </Link>
            ),
            Site: <Link href={`/sites/${data.siteId}`}>{data.site}</Link>,
            Operator: (
              <Link href={`/operators/${data.operatorId}`}>
                {data.operator}
              </Link>
            )
          }}
        />
        <Divider orientation="left" orientationMargin={0}>
          Outplants
        </Divider>

        <AdminTable
          fetcher={outplantsFetcher}
          swrKey="outplants"
          columns={[
            {
              title: 'Species',
              key: 'genus',
              render: ({ genus, species, speciesId }) => (
                <Link href={`/species/${speciesId}`}>
                  {genus} {species}
                </Link>
              )
            },
            {
              title: 'Origin',
              key: 'origin',
              dataIndex: 'origin'
            },
            {
              title: 'Count',
              key: 'count',
              dataIndex: 'count'
            },
            {
              title: 'Notes',
              key: 'notes',
              dataIndex: 'notes',
              width: 300
            }
          ]}
          summary={pageData => {
            const total = pageData.reduce((a, row) => a + row.count, 0)

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    index={0}
                    colSpan={2}
                  ></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={1}>
                    Total: {total}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )
          }}
          size="small"
          defaultFilters={{ dayId: [outplantDayId] }}
        />
      </Card>
    </>
  )
}
