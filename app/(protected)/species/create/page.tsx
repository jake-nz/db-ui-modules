'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SpeciesFields, SpeciesForm } from '../SpeciesForm'
import { createSpecies } from './createSpecies'
import { useTitle } from '@/utils/useTitle'

export default function CreateSpecies() {
  useTitle('Add New Species')
  useAssertAbility({ create: 'Species' })

  const { push } = useRouter()

  const [create, notificationContext] = useTryNotify({
    action: async (values: SpeciesFields) => {
      const id = await createSpecies(values)
      push(`/species/${id}`)
    },
    start: { message: 'Creating species' },
    success: id => ({
      message: 'Created species',
      actions: (
        <Link href={`/species/${id}`}>
          <Button type="primary">View</Button>
        </Link>
      )
    }),
    error: { message: 'Error creating species' }
  })

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
        <SpeciesForm onFinish={create} buttonText="Create Species" />
      </Card>
      {notificationContext}
    </>
  )
}
