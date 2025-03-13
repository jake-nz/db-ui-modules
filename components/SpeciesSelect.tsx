'use client'

import { speciesFetcher } from '@/app/(protected)/species/speciesFetcher'
import { Select, Typography } from 'antd'
import { ComponentProps, PropsWithRef } from 'react'
import useSWR from 'swr'

const { Text } = Typography

export const SpeciesSelect = (props: ComponentProps<typeof Select>) => {
  const { data, isLoading } = useSWR(
    {
      page: 1,
      filters: {},
      sorter: [],
      swrKey: 'species'
    },
    speciesFetcher
  )

  const options = data?.map(species => ({
    label: (
      <Text italic>
        {species.genus} {species.species}
      </Text>
    ),
    value: species.id
  }))

  return (
    <Select
      loading={isLoading}
      options={options}
      {...props}
      filterOption
      showSearch
      popupMatchSelectWidth={false}
    />
  )
}
