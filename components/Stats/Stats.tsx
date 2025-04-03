'use client'
import { Card, Col, Row, Statistic } from 'antd'
import useSWR from 'swr'
import { statsFetcher } from './statsFetcher'

export const Stats = () => {
  const { data, isLoading } = useSWR(
    { filters: {}, swrKey: 'outplants-summary' },
    statsFetcher
  )

  return (
    <Row gutter={[16, 16]} style={{ width: 500 }}>
      <Col span={12}>
        <Card variant="borderless" loading={isLoading}>
          <Statistic
            title="Corals Planted"
            value={Number(data?.totalOutplants)}
            precision={0}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card variant="borderless" loading={isLoading}>
          <Statistic
            title="Species Planted"
            value={Number(data?.speciesCount)}
            precision={0}
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card variant="borderless" loading={isLoading}>
          <Statistic
            title="Reefs"
            value={Number(data?.reefCount)}
            precision={0}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card variant="borderless" loading={isLoading}>
          <Statistic
            title="Sites"
            value={Number(data?.siteCount)}
            precision={0}
          />
        </Card>
      </Col>
    </Row>
  )
}
