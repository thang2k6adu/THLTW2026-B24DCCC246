import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import * as api from '@/services/Booking/statistics';

const Stats = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getStatistics().then(res => setData(res.data?.data));
  }, []);

  if (!data) return null;

  return (
    <Card title="Thống kê báo cáo">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng lịch hẹn" value={Object.values(data.appointmentsPerDay).reduce((a:any,b:any)=>a+b, 0) as number} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng doanh thu DV" value={Object.values(data.revenueByService).reduce((a:any,b:any)=>a+b, 0) as number} />
          </Card>
        </Col>
      </Row>
      <Card title="Lịch hẹn theo ngày" size="small" style={{ marginBottom: 16 }}>
        <pre>{JSON.stringify(data.appointmentsPerDay, null, 2)}</pre>
      </Card>
    </Card>
  );
};
export default Stats;
