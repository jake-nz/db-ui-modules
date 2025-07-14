import { Card } from 'antd'

type AuthCardProps = {
  title: string
  children: React.ReactNode
}

export const AuthCard = ({ title, children }: AuthCardProps) => (
  <Card
    title={title}
    style={{
      width: 'calc(100vw - 32px)',
      maxWidth: 500,
      margin: '0 16px'
    }}
  >
    {children}
  </Card>
)
