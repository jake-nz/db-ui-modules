'use client'

import { operatorsFetcher } from '@/app/operators/operatorsFetcher'
import { Select, Typography } from 'antd'
import { ComponentProps } from 'react'
import useSWR from 'swr'

const { Text } = Typography

export const OperatorSelect = (props: ComponentProps<typeof Select>) => {
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
      filterOption
      showSearch
      {...props}
    />
  )
}
