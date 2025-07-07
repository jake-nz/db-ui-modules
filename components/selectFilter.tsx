import { Select } from 'antd'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { ComponentProps, ReactNode } from 'react'

interface SelectFilterProps extends ComponentProps<typeof Select> {
  includeArchived?: boolean
}

type SelectComponent = (props: SelectFilterProps) => ReactNode

export const selectFilter = (Component: SelectComponent) => {
  const SelectFilter = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
      <Component
        value={selectedKeys}
        placeholder="Filter"
        popupMatchSelectWidth={false}
        allowClear
        includeArchived
        onClear={() => clearFilters && clearFilters()}
        onChange={v => {
          if (!Array.isArray(v)) v = [v]
          setSelectedKeys(v as Array<string | number>)
          confirm({ closeDropdown: true })
        }}
      />
    </div>
  )

  return SelectFilter
}
