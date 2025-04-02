'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OperatorFields, OperatorForm } from '../OperatorForm'
import { createOperator } from './createOperator'

export default function CreateOperator() {
  useAssertAbility({ create: 'Operator' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: OperatorFields) => {
      const id = await createOperator(values)
      push(`/operators/${id}`)
    },
    start: { message: 'Creating operator' },
    success: id => ({
      message: 'Created operator',
      actions: (
        <Link href={`/operators/${id}`}>
          <Button type="primary">View</Button>
        </Link>
      )
    }),
    error: { message: 'Error creating operator' }
  })

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
          { title: 'New Operator' }
        ]}
      />
      <Card
        title={
          <>
            <PlusOutlined /> New Operator
          </>
        }
        variant="borderless"
      >
        <OperatorForm onFinish={create} buttonText="Create Operator" />
      </Card>
      {notificationContext}
    </>
  )
}
