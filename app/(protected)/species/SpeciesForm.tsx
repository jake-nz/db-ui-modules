'use client'
import { Button, Form, FormProps, Input } from 'antd'

export type SpeciesFields = {
  genus: string
  species: string
}

export const SpeciesForm = function ({
  buttonText,
  ...props
}: FormProps<SpeciesFields> & { buttonText: string }) {
  return (
    <Form<SpeciesFields>
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      style={{ maxWidth: 600 }}
      {...props}
    >
      <Form.Item
        label="Genus"
        name="genus"
        rules={[{ required: true, message: 'Please enter a genus' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Species"
        name="species"
        rules={[{ required: true, message: 'Please enter a species' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  )
}
