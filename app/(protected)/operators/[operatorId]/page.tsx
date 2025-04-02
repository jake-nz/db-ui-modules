'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Details } from '@/components/Details'
import { Id } from '@/components/Id'
import { useAssertAbility } from '@/services/auth/useAbility'
import { FormOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Skeleton, Space, Tag } from 'antd'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { operatorFetcher } from './operatorFetcher'
import { useTitle } from '@/utils/useTitle'

export default function Operator() {
  const { operatorId } = useParams()
  if (Array.isArray(operatorId)) throw new Error('Multiple operatorIds')

  const { can } = useAssertAbility({ read: { Operator: { id: operatorId } } })

  const { data, error, isLoading } = useSWR(operatorId, operatorFetcher)

  useTitle(data?.name || 'Operator')

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
            href: '/operators',
            title: (
              <Space>
                <TeamOutlined />
                <span>Operators</span>
              </Space>
            )
          },
          {
            title: data.name
          }
        ]}
      />
      <Card
        title={
          <>
            <TeamOutlined /> {data.name}
          </>
        }
        variant="borderless"
        extra={
          can('edit', 'Operator') && (
            <Space>
              <Link href={`/operators/${data.id}/edit`}>
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
            ID: <Id>{data.id}</Id>,
            Name: data.name,
            Region: <Tag color={data.regionColor}>{data.region}</Tag>,
            'Total Outplants': data.totalOutplants || 0
          }}
        />
      </Card>
    </>
  )
}
