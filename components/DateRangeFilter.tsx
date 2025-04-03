import { DatePicker } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import dayjs, { Dayjs } from 'dayjs'
import { Key } from 'react'

const { RangePicker } = DatePicker

const keysToDateRange = (keys: Key[]): [Dayjs, Dayjs] | [null, null] => {
  if (!keys.length) return [null, null]
  const [start, end] = keys
  return [dayjs(Number(start)), dayjs(Number(end))]
}

const dateRangeToKeys = (
  range: [Dayjs | null, Dayjs | null] | null
): [Key, Key] | [] => {
  if (!range) return []
  const [start, end] = range
  if (!start || !end) return []
  return [start.valueOf(), end.valueOf()]
}

export const DateRangeFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm
}: FilterDropdownProps) => (
  <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
    <RangePicker
      value={keysToDateRange(selectedKeys)}
      defaultOpen
      allowClear
      onChange={v => {
        setSelectedKeys(dateRangeToKeys(v))
        confirm({ closeDropdown: true })
      }}
      maxDate={dayjs()}
    />
  </div>
)
