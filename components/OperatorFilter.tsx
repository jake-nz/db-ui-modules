import { FilterDropdownProps } from 'antd/es/table/interface'
import { OperatorSelect } from './OperatorSelect'

export const OperatorFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters
}: FilterDropdownProps) => (
  <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
    <OperatorSelect
      value={selectedKeys}
      placeholder="Filter by Operator"
      //   mode="multiple"
      allowClear
      onClear={() => clearFilters && clearFilters()}
      onChange={v => {
        setSelectedKeys([v as string | number])
        confirm({ closeDropdown: true })
      }}
    />
  </div>
)
