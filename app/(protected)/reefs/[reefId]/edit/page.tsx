'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TeamOutlined } from '@ant-design/icons'
import { Card, notification, Skeleton, Space } from 'antd'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ReefForm } from '../../ReefForm'
import { reefFetcher } from '../reefFetcher'
import { editReef, ReefFields } from './editReef'

export default function EditReef() {
  const { reefId } = useParams()
  if (Array.isArray(reefId)) throw new Error('Multiple reefIds')

  useAssertAbility({ edit: { Reef: { id: reefId } } })

  const { data, error, isLoading } = useSWR(reefId, reefFetcher)

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

  const save = async (values: ReefFields) => {
    notifications.info({
      message: `Saving ${values.name}`,
      key: 'save-reef',
      closable: false
    })

    try {
      await editReef(reefId, values)
      notifications.success({
        message: `Saved ${values.name}`,
        key: 'save-reef'
      })

      push(`/reefs/${reefId}`)
    } catch (err) {
      console.error(err)
      const getMessage = (err: any) => {
        if (err instanceof Error) {
          return err.message
        }
        if (typeof err === 'string') {
          return err
        }
        return 'Unknown error'
      }

      notifications.error({
        message: `Error saving ${values.name}`,
        description: getMessage(err),
        key: 'save-reef',
        duration: 0
      })
    }
  }

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
        <ReefForm<ReefFields>
          onFinish={save}
          initialValues={{
            name: data.name,
            region: data.regionId
          }}
          buttonText="Save Reef"
        />
      </Card>
      {notificationContext}
    </>
  )
}
