'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Coral from '@/components/icons/coral.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon, { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import { OutplantFields, OutplantForm } from '../OutplantForm'
import { createOutplants } from './createOutplants'
import { useRouter } from 'next/navigation'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import Link from 'next/link'
import { useTitle } from '@/utils/useTitle'

export default function CreateOutplantDay() {
  useTitle('Enter Outplants')
  useAssertAbility({ create: 'Outplant' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: OutplantFields) => {
      const id = await createOutplants({
        ...values,
        date: values.date.toDate()
      })
      push(`/outplants/${id}`)
    },
    start: { message: 'Creating outplants' },
    success: id => ({
      message: 'Created outplants',
      actions: (
        <Link href={`/outplants/${id}`}>
          <Button type="primary">View</Button>
        </Link>
      )
    }),
    error: { message: 'Error creating outplants' }
  })

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: '/outplants',
            title: (
              <Space>
                <Icon component={Coral} />
                <span>Outplants</span>
              </Space>
            )
          },
          { title: 'Enter Outplants' }
        ]}
      />
      <Card
        title={
          <>
            <PlusOutlined /> Planting Day
          </>
        }
        variant="borderless"
      >
        <OutplantForm onFinish={create} buttonText="Save Outplants" />
      </Card>
      {notificationContext}
    </>
  )
}
