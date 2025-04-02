'use client'

import { generaFetcher } from '@/app/(protected)/species/generaFetcher'
import { Select, Tag } from 'antd'
import { ComponentProps } from 'react'
import useSWR from 'swr'

export type GenusOption = {
  id: string
  name: string
  color: string
}

export const GenusSelect = (props: ComponentProps<typeof Select>) => {
  const { data, isLoading } = useSWR(
    {
      page: 1,
      filters: {},
      sorter: [],
      swrKey: 'genera'
    },
    generaFetcher
  )

  const options = data?.map(species => ({
    label: species.genus,
    value: species.genus
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
