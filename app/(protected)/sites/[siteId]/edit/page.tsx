'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TeamOutlined } from '@ant-design/icons'
import { Card, notification, Skeleton, Space } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { SiteForm } from '../../SiteForm'
import { siteFetcher } from '../siteFetcher'
import { editSite, SiteFields } from './editSite'

export default function EditSite() {
  const { siteId } = useParams()
  if (Array.isArray(siteId)) throw new Error('Multiple siteIds')

  useAssertAbility({ edit: { Site: { id: siteId } } })

  const { data, error, isLoading } = useSWR(siteId, siteFetcher)

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

  const save = async (values: SiteFields) => {
    notifications.info({
      message: `Saving ${values.name}`,
      key: 'save-site',
      closable: false
    })

    try {
      await editSite(siteId, values)
      notifications.success({
        message: `Saved ${values.name}`,
        key: 'save-site'
      })

      push(`/sites/${siteId}`)
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
        key: 'save-site',
        duration: 0
      })
    }
  }

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
            href: `/sites/${siteId}`,
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
        <SiteForm<SiteFields>
          onFinish={save}
          initialValues={{
            name: data.name,
            reefId: data.reefId
          }}
          buttonText="Save Site"
        />
      </Card>
      {notificationContext}
    </>
  )
}
