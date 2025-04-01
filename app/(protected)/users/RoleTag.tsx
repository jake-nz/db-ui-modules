import { Role } from '@/services/auth/permissions'
import { Tag } from 'antd'
import { ReactNode } from 'react'

const roleColors: Record<Role, string> = {
  Admin: 'red',
  Staff: 'orange',
  Operator: 'green'
}

export const RoleTag = ({
  role,
  children
}: {
  role: Role
  children?: ReactNode
}) => <Tag color={roleColors[role]}>{children || role}</Tag>
