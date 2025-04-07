'use client' // Error components must be Client Components

import { useSigninRedirect } from '@/modules/auth/components/useSigninRedirect'
import { Button, Card, Result } from 'antd'
import { ReactNode, useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Log it to the console
  useEffect(() => console.error({ error }), [error])

  const signinRedirect = useSigninRedirect()

  if (error.name === 'AuthRequiredError') return signinRedirect()

  if (error.name === 'ForbiddenError')
    return (
      <Layout>
        <Result status="error" title="Access Denied" subTitle={error.message} />
      </Layout>
    )

  if (error.message === 'no result')
    return (
      <Layout>
        <Result status="warning" title="Not Found" />
      </Layout>
    )

  return (
    <Layout>
      <Result
        status="error"
        title="Something went wrong"
        subTitle={error.message}
        extra={[
          <Button key="retry" onClick={reset}>
            Try again
          </Button>
        ]}
      />
    </Layout>
  )
}

const Layout = ({ children }: { children: ReactNode }) => (
  <Card style={{ margin: '40px auto', maxWidth: 400 }}>{children}</Card>
)
