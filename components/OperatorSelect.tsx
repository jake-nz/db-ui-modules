'use client'

import { operatorsFetcher } from '@/app/operators/operatorsFetcher'
import { Select, Typography } from 'antd'
import useSWR from 'swr'

const { Text } = Typography

export const OperatorSelect = ({
  value,
  onChange
}: {
  value?: string
  onChange?: (value: string) => void
}) => {
  const { data, isLoading } = useSWR(
    {
      page: 1,
      filters: {},
      sorter: [],
      swrKey: 'operators'
    },
    operatorsFetcher
  )

  const options = data?.map(operator => ({
    label: (
      <Text>
        {operator.name}
        <Text type="secondary"> &mdash; {operator.region}</Text>
      </Text>
    ),
    value: operator.id
  }))

  return (
    <Select
      loading={isLoading}
      options={options}
      onChange={onChange}
      value={value}
      filterOption
      showSearch
    />
  )
}
