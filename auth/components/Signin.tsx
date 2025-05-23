'use client'
import { Alert, Button, Form, Input, Space } from 'antd'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AuthCard } from './AuthCard'
import { emailRules, passwordRules } from './formRules'
import { signinWithCredentials } from '../actions/signinWithCredentials'

export const Signin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form] = Form.useForm()

  const redirectPath = useSearchParams().get('redirect')

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await signinWithCredentials(credentials.email, credentials.password)
      if (!response.error) {
        // Success!
        window.location.href = redirectPath || '/'
      } else {
        console.error(response.error)
        setError(response.error)
        setLoading(false)
      }
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Sign In">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {error && <Alert message={error} type="error" />}
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={login}>
          <Form.Item label="Email" name="email" rules={emailRules}>
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={passwordRules}
            extra={
              <Link href="/auth/forgot-password" passHref>
                Reset Password
              </Link>
            }
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </AuthCard>
  )
}
