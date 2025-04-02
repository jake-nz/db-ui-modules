'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Details } from '@/components/Details'
import { Id } from '@/components/Id'
import Globe from '@/components/icons/globe.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTitle } from '@/utils/useTitle'
import Icon from '@ant-design/icons'
import { Card, Skeleton, Space, Tag } from 'antd'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { regionFetcher } from './regionFetcher'

export default function Region() {
  useAssertAbility({ read: 'Region' })

  const { regionId } = useParams()
  if (Array.isArray(regionId)) throw new Error('Multiple regionIds')

  const { data, error, isLoading } = useSWR(regionId, regionFetcher)

  useTitle(`${data?.name || ''} Region`)

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
