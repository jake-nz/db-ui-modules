'use client'

import { operatorsFetcher } from '@/app/(protected)/operators/operatorsFetcher'
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
    searchValue: operator.name,
    value: operator.id
  }))

  return (
    <Select
      loading={isLoading}
      options={options}
      notFoundContent={isLoading ? null : undefined}
      filterOption
      optionFilterProp="searchValue"
      showSearch
      {...props}
    />
  )
}
