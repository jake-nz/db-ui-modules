'use client'
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthCard } from './AuthCard'
import { confirmPasswordRules, passwordRules } from './formRules'
const { Text } = Typography

export const PasswordReset = () => {
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [changed, setChanged] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token')
      setValidating(false)
      return
    }

    // Validate the token
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Invalid or expired token')
        }

        setValidating(false)
      } catch (err: any) {
        setError(err.message)
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const setPassword = async (credentials: { password: string }) => {
    setChanged(false)
    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: credentials.password
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to reset password')
      }

      setChanged(true)
      // Redirect to signin page after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin')
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Set New Password">
      {validating ? (
        <Validating />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={setPassword}
        >
          <Form.Item label="New Password" name="password" rules={passwordRules}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm"
            name="confirmPassword"
            dependencies={['password']}
            rules={confirmPasswordRules}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Set Password
            </Button>
          </Form.Item>
        </Form>
      )}

      {changed && <Success />}
    </AuthCard>
  )
}

const Validating = () => (
  <Alert
    message="Validating"
    description="Validating your reset token..."
    type="info"
  />
)

const ErrorMessage = ({ error }: { error: string }) => (
  <Alert
    message="Error"
    description={error}
    type="error"
    action={
      <Link href="/auth/forgot-password">
        <Button size="small" type="primary">
          Request new reset link
        </Button>
      </Link>
    }
  />
)

const Success = () => (
  <Alert
    message={
      <>
        Password successfully set. Redirecting to signin page...{' '}
        <Link href="/auth/signin">
          <Text underline>Sign in now</Text>
        </Link>
      </>
    }
    type="success"
  />
)
