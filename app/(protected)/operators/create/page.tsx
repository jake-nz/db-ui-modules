'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, notification, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OperatorForm } from '../OperatorForm'
import { createOperator, NewOperatorFields } from './createOperator'

export default function CreateOperator() {
  useAssertAbility({ create: 'Operator' })

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  const create = async (values: NewOperatorFields) => {
    notifications.info({
      message: `Creating ${values.name}`,
      key: 'create-operator',
      closable: false
    })

    try {
      const id = await createOperator(values)
      notifications.success({
        message: `Created ${values.name}`,
        actions: (
          <Link href={`/operators/${id}`}>
            <Button type="primary">View</Button>
          </Link>
        ),
        key: 'create-operator'
      })

      push(`/operators/${id}`)
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
        message: `Error creating ${values.name}`,
        description: getMessage(err),
        key: 'create-operator',
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
        <OperatorForm<NewOperatorFields> onFinish={create} buttonText="Create Operator" />
      </Card>
      {notificationContext}
    </>
  )
}