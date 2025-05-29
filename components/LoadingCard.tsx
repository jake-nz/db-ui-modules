import { Card, CardProps, Skeleton } from 'antd'

export const LoadingCard = (props: CardProps) => (
  <Card {...props}>
    <Skeleton active />
  </Card>
)
