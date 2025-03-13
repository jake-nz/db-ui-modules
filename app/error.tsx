'use client' // Error components must be Client Components

import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { Button, Card, Result } from 'antd'
import { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Log it to the console
  useEffect(() => console.error({ error }), [error])

  if (error.name === 'AuthRequiredError') return <LoginPrompt />

  if (error.name === 'ForbiddenError')
    return (
      <Card>
        <Result status="error" title="Access Denied" subTitle={error.message} />
      </Card>
    )

  return (
    <Card>
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
    </Card>
  )
}
