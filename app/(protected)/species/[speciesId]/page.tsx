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
import { speciesFetcher } from './speciesFetcher'
import { useTitle } from '@/utils/useTitle'

export default function Species() {
  const { speciesId } = useParams()
  if (Array.isArray(speciesId)) throw new Error('Multiple speciesIds')

  const { can } = useAssertAbility({ read: { Species: { id: speciesId } } })

  const { data, error, isLoading } = useSWR({ speciesId }, speciesFetcher)

  useTitle(`${data?.genus || 'Species'} ${data?.species || ''}`)

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
            href: '/species',
            title: (
              <Space>
                <TeamOutlined />
                <span>Species</span>
              </Space>
            )
          },
          {
            title: `${data.genus} ${data.species}`
          }
        ]}
      />
      <Card
        title={
          <>
            <TeamOutlined /> {data.genus} {data.species}
          </>
        }
        variant="borderless"
        extra={
          can('edit', 'Species') && (
            <Space>
              <Link href={`/species/${data.id}/edit`}>
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
            Genus: data.genus,
            Species: data.species,
            'Total Outplants': data.totalOutplants || 0
          }}
        />
      </Card>
    </>
  )
}
