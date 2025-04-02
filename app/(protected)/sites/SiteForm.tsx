'use client'
import { Button, Form, FormProps, Input } from 'antd'
import { ReefSelect } from '@/components/ReefSelect'

export type SiteFields = {
  name: string
  reefId: string
}

export const SiteForm = function ({
  buttonText,
  ...props
}: FormProps<SiteFields> & { buttonText: string }) {
  return (
    <Form<SiteFields>
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
        label="Reef"
        name="reefId"
        rules={[{ required: true, message: 'Please select a reef' }]}
      >
        <ReefSelect />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  )
}
