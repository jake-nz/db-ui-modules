import { Select } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { ComponentProps, ReactNode } from 'react'

type SelectComponent = (props: ComponentProps<typeof Select>) => ReactNode

export const selectFilter = (Component: SelectComponent) => {
  const SelectFilter = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
      <Component
        value={selectedKeys}
        placeholder="Filter"
        popupMatchSelectWidth={false}
        allowClear
        onClear={() => clearFilters && clearFilters()}
        onChange={v => {
          setSelectedKeys([v as string | number])
          confirm({ closeDropdown: true })
        }}
      />
    </div>
  )

  return SelectFilter
}
