'use client'

import { reefsFetcher } from '@/app/(protected)/reefs/reefsFetcher'
import { Select, Space, Tag, Typography } from 'antd'
import { ComponentProps } from 'react'
import useSWR from 'swr'

const { Text } = Typography

export type ReefOption = {
  id: string
  name: string
  region: string
  color: string
}

export const ReefSelect = (props: ComponentProps<typeof Select>) => {
  const { data, isLoading } = useSWR(
    {
      page: 1,
      pageSize: 100,
      filters: {},
      sorter: [],
      swrKey: 'reefs'
    },
    reefsFetcher
  )

  const options = data?.map(reef => ({
    label: (
      <Space>
        <Text>{reef.name}</Text>
        <Tag color={reef.color}>{reef.region}</Tag>
      </Space>
    ),
    searchValue: reef.name,
    value: reef.id
  }))

  return (
    <Select
      loading={isLoading}
      options={options}
      notFoundContent={isLoading ? null : undefined}
      filterOption
      showSearch
      optionFilterProp="searchValue"
      {...props}
    />
  )
}
