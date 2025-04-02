'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { TeamOutlined } from '@ant-design/icons'
import { Card, Skeleton, Space } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { OperatorFields, OperatorForm } from '../../OperatorForm'
import { operatorFetcher } from '../operatorFetcher'
import { editOperator } from './editOperator'
import { useTitle } from '@/utils/useTitle'

export default function EditOperator() {
  const { operatorId } = useParams()
  if (Array.isArray(operatorId)) throw new Error('Multiple operatorIds')

  useAssertAbility({ edit: { Operator: { id: operatorId } } })

  const { data, error, isLoading } = useSWR({ operatorId }, operatorFetcher)

  useTitle(`Edit ${data?.name || 'Operator'}`)

  const { push } = useRouter()
  const [save, notificationContext] = useTryNotify({
    action: async (values: OperatorFields) => {
      await editOperator(operatorId, values)
      push(`/operators/${operatorId}`)
    },
    start: { message: 'Saving operator' },
    success: { message: 'Saved operator' },
    error: { message: 'Error saving operator' }
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
        <OperatorForm
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
