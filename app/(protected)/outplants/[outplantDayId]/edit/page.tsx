'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { useAssertAbility } from '@/services/auth/useAbility'
import { useTryNotify } from '@/utils/useTryNotify.ts'
import Icon, { TeamOutlined } from '@ant-design/icons'
import { Card, Skeleton, Space, Typography } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { OutplantFields, OutplantForm } from '../../OutplantForm'
import { outplantDayFetcher } from '../outplantDayFetcher'
import { editOutplants } from './editOutplants'
import Coral from '@/components/icons/coral.svg'
import { outplantsFetcher } from '../outplantsFetcher'
import { Datetime } from '@/components/Datetime'
import Dayjs from 'dayjs'
import { useTitle } from '@/utils/useTitle'

const { Text } = Typography

export default function EditReef() {
  const { outplantDayId } = useParams()
  if (Array.isArray(outplantDayId)) throw new Error('Multiple outplantDayIds')

  useAssertAbility({ edit: { Outplant: { id: outplantDayId } } })

  const outplantDay = useSWR(outplantDayId, outplantDayFetcher)
  const outplants = useSWR(
    { filters: { dayId: [outplantDayId] } },
    outplantsFetcher
  )

  useTitle(`Edit Outplant Day ${outplantDay.data?.site || ''}`)

  const { push } = useRouter()

  const [save, notificationContext] = useTryNotify({
    action: async (values: OutplantFields) => {
      await editOutplants(Number(outplantDayId), {
        ...values,
        date: values.date.toDate()
      })
      push(`/outplants/${outplantDayId}`)
    },
    start: { message: 'Saving reef' },
    success: { message: 'Saved reef' },
    error: { message: 'Error saving reef' }
  })

  if (outplantDay.error) throw outplantDay.error
  if (outplants.error) throw outplants.error
  if (
    outplantDay.isLoading ||
    !outplantDay.data ||
    outplants.isLoading ||
    !outplants.data
  )
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
            href: '/outplants',
            title: (
              <Space>
                <Icon component={Coral} />
                <span>Outplants</span>
              </Space>
            )
          },
          {
            title: (
              <Space>
                <Text>
                  <Datetime>{outplantDay.data.date}</Datetime>,
                </Text>
                <Text>{outplantDay.data.operator},</Text>
                <Text>{outplantDay.data.site}</Text>
              </Space>
            )
          },
          { title: 'Edit' }
        ]}
      />
      <Card
        title={
          <>
            <TeamOutlined /> Edit
          </>
        }
        variant="borderless"
      >
        <OutplantForm
          onFinish={save}
          initialValues={{
            operator: outplantDay.data.operatorId,
            site: outplantDay.data.siteId,
            crew: outplantDay.data.crew,
            funding: outplantDay.data.funding,
            date: Dayjs(outplantDay.data.date),
            outplants: outplants.data.map(
              ({ id, speciesId, morph, count, origin }) => ({
                key: id,
                species: speciesId,
                morphology: morph,
                count,
                origin
              })
            )
          }}
          buttonText="Save Outplants"
        />
      </Card>
      {notificationContext}
    </>
  )
}
