'use client'
import { Button, Form, FormProps, Input } from 'antd'
import { RegionSelect } from '@/components/RegionSelect'

export type ReefFields = {
  name: string
  regionId: string
}

export const ReefForm = function ({
  buttonText,
  ...props
}: FormProps<ReefFields> & { buttonText: string }) {
  return (
    <Form<ReefFields>
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
        label="Region"
        name="regionId"
        rules={[{ required: true, message: 'Please select a region' }]}
      >
        <RegionSelect />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  )
}
