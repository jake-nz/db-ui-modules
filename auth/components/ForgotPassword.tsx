'use client'
import { Alert, Button, Form, Input, Space } from 'antd'
import { useState } from 'react'
import { AuthCard } from './AuthCard'
import { emailRules } from './formRules'
import { forgotPassword } from '../actions/forgotPassword'
import { getURL } from '@/modules/utils/getURL'

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const reset = async (credentials: { email: string }) => {
    setSent(false)
    setLoading(true)
    try {
      await forgotPassword({
        email: credentials.email,
        redirectTo: getURL() + 'auth/reset-password'
      })
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Reset Password">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {error && <Alert message={error} type="error" />}
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={reset}>
          <Form.Item label="Email" name="email" rules={emailRules}>
            <Input type="email" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send reset link
            </Button>
          </Form.Item>
        </Form>
        {sent && <Alert message="Reset link sent. Please check your inbox" type="success" />}
      </Space>
    </AuthCard>
  )
}
