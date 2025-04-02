'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Coral from '@/components/icons/coral.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon, { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import { OutplantForm } from '../OutplantForm'
import { createOutplants, NewOutplantsFields } from './createOutplants'
import { useRouter } from 'next/navigation'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import Link from 'next/link'

export default function CreateOutplantDay() {
  useAssertAbility({ create: 'Outplant' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: NewOutplantsFields) => {
      const id = await createOutplants(values)
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
        <OutplantForm<NewOutplantsFields>
          onFinish={create}
          buttonText="Save Outplants"
        />
      </Card>
      {notificationContext}
    </>
  )
}
