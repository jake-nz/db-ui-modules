'use client'
import { Descriptions, DescriptionsProps } from 'antd'
import { ReactNode } from 'react'

export const Details = ({
  details,
  ...props
}: DescriptionsProps & {
  details: Record<string, ReactNode>
}) => {
  return (
    <Descriptions
      column={1}
      items={Object.entries(details).map(([key, value]) => ({
        key,
        label: key,
        children: value
      }))}
      {...props}
    />
  )
}
