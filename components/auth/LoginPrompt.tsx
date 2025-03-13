'use client'
import { Button, Card, Result } from 'antd'
import Link from 'next/link'

export const LoginPrompt = () => (
  <Card>
    <Result
      status="warning"
      title="Please log in to continue"
      extra={[
        <Link href="/auth/signin" key="login">
          <Button type="primary">Log in</Button>
        </Link>
      ]}
    />
  </Card>
)
