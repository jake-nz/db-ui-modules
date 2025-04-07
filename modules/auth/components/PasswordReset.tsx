'use client'
import { Alert, Button, Form, Input, Skeleton, Typography } from 'antd'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthCard } from './AuthCard'
import { confirmPasswordRules, passwordRules } from './formRules'
import { validateToken } from '../actions/validateToken'
import { resetPassword } from '../actions/resetPassword'
import { useTitle } from '@/utils/useTitle'
const { Text } = Typography

type Status = 'validating' | 'loading' | 'success' | null

export const PasswordReset = () => {
  useTitle('Set Password')
  const [status, setStatus] = useState<Status>('validating')
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token')
      setStatus(null)
      return
    }

    // Validate the token
    const tryValidateToken = async () => {
      try {
        const valid = await validateToken(token)
        if (!valid) setError('Invalid or expired token')
      } catch (err: any) {
        setError(err.message)
      }
      setStatus(null)
    }

    tryValidateToken()
  }, [token])

  const setPassword = async (credentials: { password: string }) => {
    setStatus('loading')
    try {
      const response = await resetPassword({
        token: token!,
        password: credentials.password
      })

      if (response.error)
        throw new Error(response.error || 'Failed to reset password')

      setStatus('success')
      // Redirect to signin page after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin')
      }, 3000)
    } catch (err: any) {
      setError(err.message)
      setStatus(null)
    }
  }

  return (
    <AuthCard title="Set New Password">
      {status === 'validating' ? (
        <Skeleton active />
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
            <Button
              type="primary"
              htmlType="submit"
              loading={status === 'loading'}
            >
              Set Password
            </Button>
          </Form.Item>
        </Form>
      )}

      {status === 'success' && <Success />}
    </AuthCard>
  )
}

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
