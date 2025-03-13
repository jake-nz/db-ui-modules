import { Card } from 'antd'

type AuthCardProps = {
  title: string
  children: React.ReactNode
}

export const AuthCard = ({ title, children }: AuthCardProps) => (
  <Card title={title} style={{ maxWidth: '100%', width: 500 }}>
    {children}
  </Card>
)
