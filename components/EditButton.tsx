import { FormOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Link from 'next/link'

export const EditButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button size="small" icon={<FormOutlined />}>
      Edit
    </Button>
  </Link>
)
