'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, notification, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SpeciesForm } from '../SpeciesForm'
import { createSpecies, NewSpeciesFields } from './createSpecies'

export default function CreateSpecies() {
  useAssertAbility({ create: 'Species' })

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  const create = async (values: NewSpeciesFields) => {
    notifications.info({
      message: `Creating ${values.genus} ${values.species}`,
      key: 'create-species',
      closable: false
    })

    try {
      const id = await createSpecies(values)
      notifications.success({
        message: `Created ${values.genus} ${values.species}`,
        actions: (
          <Link href={`/species/${id}`}>
            <Button type="primary">View</Button>
          </Link>
        ),
        key: 'create-species'
      })

      push(`/species/${id}`)
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
        message: `Error creating ${values.genus} ${values.species}`,
        description: getMessage(err),
        key: 'create-species',
        duration: 0
      })
    }
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: '/species',
            title: (
              <Space>
                <TeamOutlined />
                <span>Species</span>
              </Space>
            )
          },
          { title: 'New Species' }
        ]}
      />
      <Card
        title={
          <>
            <PlusOutlined /> New Species
          </>
        }
        variant="borderless"
      >
        <SpeciesForm<NewSpeciesFields>
          onFinish={create}
          buttonText="Create Species"
        />
      </Card>
      {notificationContext}
    </>
  )
}
