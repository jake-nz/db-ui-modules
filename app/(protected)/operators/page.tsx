'use client'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Boat from '@/components/icons/sailboat-line.svg'
import { useAssertAbility } from '@/services/auth/useAbility'
import Icon, { PlusOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import Link from 'next/link'
import { OperatorList } from './OperatorList'
import { useTitle } from '@/utils/useTitle'

export default function Operators() {
  useTitle('Operators')
  const { can } = useAssertAbility({ read: 'Operator' })

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <Icon component={Boat} />
                <span>Operators</span>
              </Space>
            )
          }
        ]}
        extra={
          can('create', 'Operator') && (
            <Link href="/operators/create">
              <Button size="small" icon={<PlusOutlined />}>
                New Operator
              </Button>
            </Link>
          )
        }
      />
      <OperatorList />
    </>
  )
}
