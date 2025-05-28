'use client'
import { Descriptions, DescriptionsProps } from 'antd'
import { ReactNode } from 'react'

interface DetailsProps extends DescriptionsProps {
  details: Record<string, ReactNode>
}

export const Details = ({ details, ...props }: DetailsProps) => {
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
