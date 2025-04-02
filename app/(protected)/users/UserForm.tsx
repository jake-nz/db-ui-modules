'use client'
import { OperatorSelect } from '@/components/OperatorSelect'
import { useAssertAbility } from '@/services/auth/useAbility'
import { Button, Form, FormProps, Input, Select } from 'antd'
import { RoleTag } from './RoleTag'
import { Role } from '@/services/auth/permissions'

export type UserFields = {
  name: string
  email: string
  role: Role
  operatorId?: string
}

export const UserForm = function ({
  buttonText,
  ...props
}: FormProps<UserFields> & { buttonText: string }) {
  useAssertAbility({ create: 'User' })

  const [form] = Form.useForm()
  const role = Form.useWatch('role', form)

  return (
    <Form<UserFields>
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      style={{ maxWidth: 600 }}
      {...props}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter a name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please enter an email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: 'Please enter a role' }]}
      >
        <Select
          options={[
            { label: <RoleTag role="Admin" />, value: 'Admin' },
            {
              label: <RoleTag role="Staff">CNP Staff</RoleTag>,
              value: 'Staff'
            },
            {
              label: <RoleTag role="Operator">Operator Staff</RoleTag>,
              value: 'Operator'
            }
          ]}
        />
      </Form.Item>
      {role === 'Operator' && (
        <Form.Item
          label="Operator"
          name="operatorId"
          rules={[{ required: true, message: 'Please enter a role' }]}
        >
          <OperatorSelect popupMatchSelectWidth={false} />
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  )
}
