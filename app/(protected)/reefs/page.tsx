'use client'
import { ReefList } from './ReefList'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Space } from 'antd'
import { useAssertAbility } from '@/services/auth/useAbility'
import ReefIcon from '@/components/icons/reef.svg'
import Icon from '@ant-design/icons'

export default function Reefs() {
  useAssertAbility({ read: 'Reef' })

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
      />
      <ReefList />
    </>
  )
}
