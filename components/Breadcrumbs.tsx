'use client'
import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import {
  BreadcrumbItemType,
  BreadcrumbProps
} from 'antd/es/breadcrumb/Breadcrumb'
import Link from 'next/link'

const itemRender: BreadcrumbProps['itemRender'] = currentRoute => {
  return currentRoute.href ? (
    <Link href={currentRoute.href}>{currentRoute.title}</Link>
  ) : (
    <span>{currentRoute.title}</span>
  )
}

export const Breadcrumbs = ({
  items,
  extra
}: {
  items: BreadcrumbItemType[]
  extra?: React.ReactNode
}) => {
  return (
    <div
      style={{
        marginTop: -20,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Breadcrumb
        itemRender={itemRender}
        items={[
          {
            href: '/',
            title: <HomeOutlined />
          },
          ...items
        ]}
      />
      {extra}
    </div>
  )
}
