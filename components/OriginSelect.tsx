'use client'

import { Radio, RadioChangeEvent } from 'antd'

import { origins } from './OriginTag'

export const OriginSelect = ({
  value,
  onChange
}: {
  value?: string
  onChange?: (value: string) => void
}) => {
  return (
    <>
      {/* <Select
        options={Object.keys(origins).map(option => ({
          value: option,
          label: <OriginTag origin={option as Origin} />
        }))}
        onChange={onChange}
        value={value}
        defaultActiveFirstOption
        filterOption
        showSearch
      /> */}
      <Radio.Group
        options={Object.values(origins)}
        onChange={({ target: { value } }: RadioChangeEvent) =>
          onChange?.(value)
        }
        value={value}
        optionType="button"
        buttonStyle="solid"
      />
    </>
  )
}
