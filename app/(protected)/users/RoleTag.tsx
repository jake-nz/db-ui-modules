import { Role } from '@/services/auth/permissions'
import { Tag } from 'antd'

const roleColors: Record<Role, string> = {
  Admin: 'red',
  Staff: 'orange',
  Operator: 'green'
}

export const RoleTag = ({ role }: { role: Role }) => (
  <Tag color={roleColors[role]}>{role}</Tag>
)
