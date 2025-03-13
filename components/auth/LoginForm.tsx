'use client'

import { Alert, Button, Form, Input, Space } from 'antd'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signinWithCredentials } from '../../auth/components/signinWithCredentials'

export const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true)
    const response = await signinWithCredentials(
      credentials.email,
      credentials.password
    )
    console.log(response)
    if (response.error) {
      console.error(response.error)
      form.setFields([{ name: 'password', errors: [response.error] }])
    } else {
      onLogin()
    }
    setLoading(false)
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* {error && <Alert message={error} type="error" />} */}
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={login}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please enter your email'
            },
            {
              type: 'email',
              message: 'Please enter a valid email'
            }
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Please enter your full password' }
          ]}
          extra={
            <Link href="/auth/forgot" passHref>
              Reset Password
            </Link>
          }
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
