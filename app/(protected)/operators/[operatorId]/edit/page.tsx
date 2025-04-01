'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { TeamOutlined } from '@ant-design/icons'
import { Card, notification, Skeleton, Space } from 'antd'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { OperatorForm } from '../../OperatorForm'
import { operatorFetcher } from '../operatorFetcher'
import { editOperator, OperatorFields } from './editOperator'

export default function EditOperator() {
  const { operatorId } = useParams()
  if (Array.isArray(operatorId)) throw new Error('Multiple operatorIds')

  useAssertAbility({ edit: { Operator: { id: operatorId } } })

  const { data, error, isLoading } = useSWR(operatorId, operatorFetcher)

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

  const save = async (values: OperatorFields) => {
    notifications.info({
      message: `Saving ${values.name}`,
      key: 'save-operator',
      closable: false
    })

    try {
      await editOperator(operatorId, values)
      notifications.success({
        message: `Saved ${values.name}`,
        key: 'save-operator'
      })

      push(`/operators/${operatorId}`)
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
        key: 'save-operator',
        duration: 0
      })
    }
  }

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
            href: `/operators/${operatorId}`,
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
        <OperatorForm<OperatorFields>
          onFinish={save}
          initialValues={{
            name: data.name,
            region: data.regionId
          }}
          buttonText="Save Operator"
        />
      </Card>
      {notificationContext}
    </>
  )
}