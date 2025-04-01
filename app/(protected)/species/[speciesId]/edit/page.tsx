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

export default function EditSpecies() {
  const { speciesId } = useParams()
  if (Array.isArray(speciesId)) throw new Error('Multiple speciesIds')

  useAssertAbility({ edit: { Species: { id: speciesId } } })

  const { data, error, isLoading } = useSWR(speciesId, speciesFetcher)

  const [notifications, notificationContext] = notification.useNotification()
  const { push } = useRouter()

  if (error) throw error
  if (isLoading || !data)
    return (
      <Card variant="borderless">
        <Skeleton active />
      </Card>
    )

  const save = async (values: SpeciesFields) => {
    notifications.info({
      message: `Saving ${values.genus} ${values.species}`,
      key: 'save-species',
      closable: false
    })

    try {
      await editSpecies(speciesId, values)
      notifications.success({
        message: `Saved ${values.genus} ${values.species}`,
        key: 'save-species'
      })

      push(`/species/${speciesId}`)
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
        message: `Error saving ${values.genus} ${values.species}`,
        description: getMessage(err),
        key: 'save-species',
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
