import { Space } from 'antd'

export const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <Space
    direction="vertical"
    size="large"
    style={{
      width: '100%',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fafafa',
      padding: '16px 0',
    }}
  >
    {children}
  </Space>
)
