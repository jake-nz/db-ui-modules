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
import { siteFetcher } from './siteFetcher'
import { useTitle } from '@/utils/useTitle'

export default function Site() {
  const { siteId } = useParams()
  if (Array.isArray(siteId)) throw new Error('Multiple siteIds')

  const { can } = useAssertAbility({ read: { Site: { id: siteId } } })

  const { data, error, isLoading } = useSWR(siteId, siteFetcher)

  useTitle(`Site ${data?.name || ''}`)

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
            href: '/sites',
            title: (
              <Space>
                <TeamOutlined />
                <span>Sites</span>
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
          can('edit', 'Site') && (
            <Space>
              <Link href={`/sites/${data.id}/edit`}>
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
            Reef: (
              <Space>
                <Link href={`/reefs/${data.reefId}`}>{data.reefName}</Link>
                <Link href={`/regions/${data.regionId}`}>
                  <Tag color={data.regionColor}>{data.region}</Tag>
                </Link>
              </Space>
            ),
            'Total Outplants': data.totalOutplants || 0
          }}
        />
      </Card>
    </>
  )
}
