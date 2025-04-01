'use client'

import { Select } from 'antd'
import { ComponentProps } from 'react'

const options = [
  'Bushy',
  'Branching',
  'Plating',
  'Submassive',
  'Bottlebrush',
  'Foliose'
]

export const MorphologySelect = (props: ComponentProps<typeof Select>) => (
  <Select
    options={options.map(option => ({ value: option, label: option }))}
    {...props}
    filterOption
    optionFilterProp="label"
    showSearch
  />
)
