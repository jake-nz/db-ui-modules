'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { TeamOutlined } from '@ant-design/icons'
import { Card, Skeleton, Space } from 'antd'
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

  const { push } = useRouter()

  const [save, notificationContext] = useTryNotify({
    action: async (values: SiteFields) => {
      await editSite(siteId, values)
      push(`/sites/${siteId}`)
    },
    start: { message: 'Saving site' },
    success: { message: 'Saved site' },
    error: { message: 'Error saving site' }
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
