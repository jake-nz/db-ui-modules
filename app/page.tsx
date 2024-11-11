import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Statistic } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', alignItems: 'center' }}
    >
      <Image
        src={'/images/logo-dark.png'}
        width={1609 / 7}
        height={1154 / 7}
        alt="logo"
      />
      <Space direction="vertical" size="middle" style={{ width: 500 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Outplants this month"
                value={2145}
                precision={0}
                // valueStyle={{ color: '#3f8600' }}
                // prefix={<ArrowUpOutlined />}
                // suffix="%"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Outplants this year"
                value={105392}
                precision={0}
                // valueStyle={{ color: '#cf1322' }}
                // prefix={<ArrowDownOutlined />}
                // suffix="%"
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Number of species"
                value={71}
                precision={0}
                // valueStyle={{ color: '#3f8600' }}
                // prefix={<ArrowUpOutlined />}
                // suffix="%"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Planting hours"
                value={1840}
                precision={0}
                // valueStyle={{ color: '#cf1322' }}
                // prefix={<ArrowDownOutlined />}
                // suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </Space>
      <Link href="/outplants/create">
        <Button type="primary" icon={<PlusOutlined />}>
          Enter Outplants
        </Button>
      </Link>
    </Space>
  )
}
