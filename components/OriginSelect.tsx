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
    <Radio.Group
      options={Object.values(origins)}
      onChange={({ target: { value } }: RadioChangeEvent) => onChange?.(value)}
      value={value}
      optionType="button"
      buttonStyle="solid"
      style={{ whiteSpace: 'nowrap' }}
    />
  )
}
