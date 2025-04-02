'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { TeamOutlined } from '@ant-design/icons'
import { Card, Skeleton, Space } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ReefFields, ReefForm } from '../../ReefForm'
import { reefFetcher } from '../reefFetcher'
import { editReef } from './editReef'
import { useTitle } from '@/utils/useTitle'

export default function EditReef() {
  const { reefId } = useParams()
  if (Array.isArray(reefId)) throw new Error('Multiple reefIds')

  useAssertAbility({ edit: { Reef: { id: reefId } } })

  const { data, error, isLoading } = useSWR(reefId, reefFetcher)

  useTitle(`Edit Reef ${data?.name || ''}`)

  const { push } = useRouter()

  const [save, notificationContext] = useTryNotify({
    action: async (values: ReefFields) => {
      await editReef(reefId, values)
      push(`/reefs/${reefId}`)
    },
    start: { message: 'Saving reef' },
    success: { message: 'Saved reef' },
    error: { message: 'Error saving reef' }
  })

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
            href: `/reefs/${reefId}`,
            title: data.name
          },
          { title: 'Edit' }
        ]}
      />
      <Card
        title={
          <>
            <TeamOutlined /> Edit {data.name}
          </>
        }
        variant="borderless"
      >
        <ReefForm
          onFinish={save}
          initialValues={{
            name: data.name,
            regionId: data.regionId
          }}
          buttonText="Save Reef"
        />
      </Card>
      {notificationContext}
    </>
  )
}
