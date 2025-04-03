'use client'

import { sitesFetcher } from '@/app/(protected)/sites/sitesFetcher'
import { Form, Select, Typography } from 'antd'
import { useEffect } from 'react'
import useSWR from 'swr'

const { Text } = Typography

export const SiteSelect = ({
  value,
  onChange,
  operator
}: {
  value?: string
  onChange?: (value: string | null) => void
  operator: string | null
}) => {
  const { data, isLoading } = useSWR(
    operator
      ? {
          page: 1,
          pageSize: 100,
          filters: { operator: [operator] },
          sorter: [],
          swrKey: 'sites'
        }
      : null,
    sitesFetcher
  )

  const form = Form.useFormInstance()

  useEffect(() => {
    if (data && data.length && value) {
      if (!data.find(site => site.id === value)) {
        form.resetFields(['site'])
      }
    }
    if (!value && data?.length === 1 && value !== data[0].id) {
      onChange?.(data[0].id)
    }
  }, [data, value, onChange, form])

  const options = data?.map(site => ({
    label: (
      <>
        <Text>
          {site.name}
          <Text type="secondary"> &mdash; {site.reef}</Text>
        </Text>
      </>
    ),
    searchValue: site.name,
    value: site.id
  }))

  return (
    <Select
      loading={isLoading}
      options={options}
      disabled={!operator}
      onChange={onChange}
      value={value}
      filterOption
      optionFilterProp="searchValue"
      showSearch
    />
  )
}
