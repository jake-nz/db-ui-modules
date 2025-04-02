'use client'
import { ReefList } from './ReefList'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Button, Space } from 'antd'
import { useAssertAbility } from '@/services/auth/useAbility'
import ReefIcon from '@/components/icons/reef.svg'
import Icon, { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useTitle } from '@/utils/useTitle'

export default function Reefs() {
  useTitle('Reefs')
  const { can } = useAssertAbility({ read: 'Reef' })

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: (
              <Space>
                <Icon component={ReefIcon} />
                <span>Reefs</span>
              </Space>
            )
          }
        ]}
        extra={
          can('create', 'Reef') && (
            <Link href="/reefs/create">
              <Button size="small" icon={<PlusOutlined />}>
                New Reef
              </Button>
            </Link>
          )
        }
      />
      <ReefList />
    </>
  )
}
