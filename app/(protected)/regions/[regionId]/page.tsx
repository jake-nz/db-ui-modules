'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Details } from '@/components/Details'
import { Id } from '@/components/Id'
import Globe from '@/components/icons/globe.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import { FormOutlined } from '@ant-design/icons'
import Icon from '@ant-design/icons'
import { Button, Card, Skeleton, Space, Tag } from 'antd'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { regionFetcher } from './regionFetcher'

export default function Region() {
  const { regionId } = useParams()
  if (Array.isArray(regionId)) throw new Error('Multiple regionIds')

  const { can } = useAssertAbility({ read: 'Region' })

  const { data, error, isLoading } = useSWR(regionId, regionFetcher)

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
            href: '/regions',
            title: (
              <Space>
                <Icon component={Globe} />
                <span>Regions</span>
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
            <Icon component={Globe} /> {data.name}
          </>
        }
        variant="borderless"
        extra={
          can('edit', 'Operator') && (
            <Space>
              <Link href={`/regions/${data.id}/edit`}>
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
            Name: <Tag color={data.color}>{data.name}</Tag>,
            'Total Outplants': data.totalOutplants || 0
          }}
        />
      </Card>
    </>
  )
}
