import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Statistic } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Coral Nurture Program Database'
}

export default function Home() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', alignItems: 'center' }}
    >
      <Image
        src="/images/logo-dark.png"
        width={1609 / 7}
        height={1154 / 7}
        alt="logo"
        priority
      />
      <Space direction="vertical" size="middle" style={{ width: 500 }}>
        Note: These are not real numbers. What metrics do we want here?
        <Row gutter={16}>
          <Col span={12}>
            <Card variant="borderless">
              <Statistic
                title="Outplants this month"
                value={2145}
                precision={0}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card variant="borderless">
              <Statistic
                title="Outplants this year"
                value={105392}
                precision={0}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card variant="borderless">
              <Statistic title="Number of species" value={71} precision={0} />
            </Card>
          </Col>
          <Col span={12}>
            <Card variant="borderless">
              <Statistic title="Planting hours" value={1840} precision={0} />
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
