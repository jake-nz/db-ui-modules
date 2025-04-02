'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { NodeExpandOutlined } from '@ant-design/icons'
import { Card, notification, Skeleton, Space } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { SpeciesForm } from '../../SpeciesForm'
import { speciesFetcher } from '../speciesFetcher'
import { editSpecies, SpeciesFields } from './editSpecies'
import { useTryNotify } from '@/utils/useTryNotify.ts'

export default function EditSpecies() {
  const { speciesId } = useParams()
  if (Array.isArray(speciesId)) throw new Error('Multiple speciesIds')

  useAssertAbility({ edit: { Species: { id: speciesId } } })

  const { data, error, isLoading } = useSWR(speciesId, speciesFetcher)

  const { push } = useRouter()

  const [save, notificationContext] = useTryNotify({
    action: async (values: SpeciesFields) => {
      await editSpecies(speciesId, values)
      push(`/species/${speciesId}`)
    },
    start: { message: 'Saving species' },
    success: { message: 'Saved species' },
    error: { message: 'Error saving species' }
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
            href: '/species',
            title: (
              <Space>
                <NodeExpandOutlined />
                <span>Species</span>
              </Space>
            )
          },
          {
            href: `/species/${speciesId}`,
            title: `${data.genus} ${data.species}`
          },
          { title: 'Edit' }
        ]}
      />
      <Card
        title={
          <>
            <NodeExpandOutlined /> Edit {data.genus} {data.species}
          </>
        }
        variant="borderless"
      >
        <SpeciesForm<SpeciesFields>
          onFinish={save}
          initialValues={{
            genus: data.genus,
            species: data.species
          }}
          buttonText="Save Species"
        />
      </Card>
      {notificationContext}
    </>
  )
}
