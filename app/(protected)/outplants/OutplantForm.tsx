'use client'
import { MorphologySelect } from '@/components/MorphologySelect'
import { OperatorSelect } from '@/components/OperatorSelect'
import { OriginSelect } from '@/components/OriginSelect'
import { SiteSelect } from '@/components/SiteSelect'
import { SpeciesSelect } from '@/components/SpeciesSelect'
import { Origin } from '@/services/database/database.types'
import { useOperator } from '@/utils/useOperator'
import { MinusCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Flex,
  Form,
  FormListFieldData,
  FormProps,
  Input,
  Select,
  Table,
  TableColumnsType,
  Tooltip
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'

export type OutplantFields = {
  date: Dayjs
  operator: string
  site: string
  crew: number
  funding: string
  outplants: Array<{
    species: string
    morphology: string
    count: number
    origin: Origin
    key: number
  }>
}

export const OutplantForm = function ({
  buttonText,
  ...props
}: FormProps<OutplantFields> & { buttonText: string }) {
  const [form] = Form.useForm()

  const userOperator = useOperator()
  const selectedOperator = Form.useWatch('operator', form)
  const operator = userOperator || selectedOperator

  // Watches the 'outplants' field in the form and automatically adds a new empty outplant
  // entry when the last outplant's origin is set
  const outplants = Form.useWatch('outplants', form)
  useEffect(() => {
    if (!outplants?.length) return // Exit if no outplants exist
    const last = outplants[outplants.length - 1] // Get the last outplant entry
    if (!last.origin) return // Exit if the last outplant has no origin yet (that entry is not complete)
    // Add a new empty outplant with an incremented key
    const key = nanoid()
    form.setFieldsValue({ outplants: [...outplants, { key }] })
  }, [outplants, form])

  return (
    <Form<OutplantFields>
      layout="vertical"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      {...props}
    >
      <div style={{ maxWidth: 600 }}>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please enter a date' }]}
        >
          <DatePicker autoFocus maxDate={dayjs()} allowClear={false} />
        </Form.Item>
        {/* Operator is null - all operators can be selected */}
        {userOperator === null && (
          <Form.Item
            label="Operator"
            name="operator"
            rules={[{ required: true, message: 'Please select an operator' }]}
          >
            <OperatorSelect />
          </Form.Item>
        )}
        {/* Operator is not null - only the user's operator can be selected */}
        {userOperator && (
          <Form.Item noStyle name="operator" initialValue={userOperator}>
            <Input disabled type="hidden" />
          </Form.Item>
        )}
        <Form.Item
          label="Site"
          name="site"
          help={!operator && 'Choose an operator to see sites'}
          rules={[{ required: true, message: 'Please select a site' }]}
        >
          <SiteSelect operator={operator} />
        </Form.Item>
        <Form.Item
          label="Number of crew"
          name="crew"
          rules={[
            {
              required: true,
              min: 1,
              message: 'Please enter the number of crew',
              transform: Number
            }
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Funding source"
          name="funding"
          rules={[
            {
              required: true,
              message: 'Please select the funding source'
            }
          ]}
        >
          <Select
            options={[
              {
                label: 'GBRF phase 1-2',
                value: 'GBRF12'
              },
              {
                label: 'GBRF phase 3',
                value: 'GBRF3'
              },
              {
                label: 'GBRF phase 4',
                value: 'GBRF4'
              },
              {
                label: 'Diageo',
                value: 'Diageo'
              },
              {
                label: 'TRPI',
                value: 'TRPI'
              }
            ]}
          />
        </Form.Item>
      </div>

      <Divider orientation="left" orientationMargin={0}>
        Outplants
      </Divider>

      <Form.List name="outplants" initialValue={[{ key: 0 }]}>
        {(fields, { add, remove }) => (
          <Table
            dataSource={fields}
            columns={columns(remove)}
            pagination={false}
            summary={pageData => {
              const total = form
                .getFieldValue('outplants')
                .reduce(
                  (a: number, row: { count: number }) =>
                    a + Number(row.count || 0),
                  0
                )

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={2}
                    ></Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1}>
                      Total: {total}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={2}
                      colSpan={2}
                    ></Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )
            }}
          />
        )}
      </Form.List>
      <Flex justify="flex-end" style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit">
          {buttonText}
        </Button>
      </Flex>
    </Form>
  )
}

const useRowHasData = (name: string) => {
  const form = Form.useFormInstance()
  const outplants = form.getFieldValue('outplants')
  const row = outplants[name]
  return row.count || row.origin || row.morphology || row.species
}

const columns = (
  remove: (index: number | number[]) => void
): TableColumnsType<FormListFieldData> => [
  {
    title: 'Species',
    key: 'species',
    render: function Render({ key, name, ...restField }) {
      const rowHasData = useRowHasData(name)
      return (
        <Form.Item
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, 'species']}
          rules={[{ required: rowHasData, message: 'Please select a species' }]}
        >
          <SpeciesSelect style={{ minWidth: 200 }} />
        </Form.Item>
      )
    }
  },
  {
    title: 'Morphology',
    key: 'morphology',
    render: function Render({ key, name, ...restField }) {
      const rowHasData = useRowHasData(name)
      return (
        <Form.Item
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, 'morphology']}
          rules={[
            {
              required: rowHasData,
              message: 'Please select a morphology'
            }
          ]}
        >
          <MorphologySelect style={{ minWidth: 200 }} />
        </Form.Item>
      )
    }
  },
  {
    title: 'Count',
    key: 'count',
    render: function Render({ key, name, ...restField }) {
      const rowHasData = useRowHasData(name)
      return (
        <Form.Item
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, 'count']}
          rules={
            rowHasData && [
              {
                required: true,
                min: 1,
                message: 'Please enter the count',
                transform: Number
              }
            ]
          }
        >
          <Input type="number" style={{ width: 80 }} />
        </Form.Item>
      )
    }
  },
  {
    title: 'Origin',
    key: 'origin',
    render: function Render({ key, name, ...restField }) {
      const rowHasData = useRowHasData(name)
      return (
        <Form.Item
          style={{ marginBottom: 0 }}
          {...restField}
          name={[name, 'origin']}
          rules={[{ required: rowHasData, message: 'Please select an origin' }]}
        >
          <OriginSelect />
        </Form.Item>
      )
    }
  },
  {
    key: 'remove',
    render: function Render({ name }) {
      const hasData = useRowHasData(name)
      return (
        <Tooltip title={!hasData && 'Blank row will not be saved'}>
          <MinusCircleOutlined
            onClick={() => hasData && remove(name)}
            style={hasData ? {} : { opacity: 0.4, cursor: 'default' }}
          />
        </Tooltip>
      )
    }
  }
]
