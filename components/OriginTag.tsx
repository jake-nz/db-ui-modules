import { Origin } from '@/services/database/database.d'
import { Tag } from 'antd'

export const origins: Record<
  Origin,
  { value: Origin; label: string; color: string }
> = {
  'Fragment of Opportunity': {
    value: 'Fragment of Opportunity',
    label: 'FoO',
    color: 'red'
  },
  'Donor Colony': { value: 'Donor Colony', label: 'Donor', color: 'green' },
  Nursery: { value: 'Nursery', label: 'Nursery', color: 'blue' }
}

export const OriginTag = ({ origin }: { origin: Origin }) => {
  const { label, color } = origins[origin]
  return <Tag color={color}>{label}</Tag>
}
