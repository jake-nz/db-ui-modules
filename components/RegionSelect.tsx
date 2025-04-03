'use client'

import { regionsFetcher } from '@/app/(protected)/regions/regionsFetcher'
import { Select, Tag } from 'antd'
import { ComponentProps } from 'react'
import useSWR from 'swr'

export type RegionOption = {
  id: string
  name: string
  color: string
}

export const RegionSelect = (props: ComponentProps<typeof Select>) => {
  const { data, isLoading } = useSWR(
    {
      page: 1,
      pageSize: 100,
      filters: {},
      sorter: [],
      swrKey: 'regions'
    },
    regionsFetcher
  )

  const options = data?.map(region => ({
    label: <Tag color={region.color}>{region.name}</Tag>,
    value: region.id
  }))

  return (
    <Select
      loading={isLoading}
      options={options}
      notFoundContent={isLoading ? null : undefined}
      filterOption
      showSearch
      {...props}
    />
  )
}
