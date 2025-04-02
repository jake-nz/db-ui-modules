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
import { reefFetcher } from './reefFetcher'
import { useTitle } from '@/utils/useTitle'

export default function Reef() {
  const { reefId } = useParams()
  if (Array.isArray(reefId)) throw new Error('Multiple reefIds')

  const { can } = useAssertAbility({ read: { Reef: { id: reefId } } })

  const { data, error, isLoading } = useSWR({ reefId }, reefFetcher)

  useTitle(data?.name || 'Reef')

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
            href: '/reefs',
            title: (
              <Space>
                <TeamOutlined />
                <span>Reefs</span>
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
          can('edit', 'Reef') && (
            <Space>
              <Link href={`/reefs/${data.id}/edit`}>
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
