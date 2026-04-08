import React from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Empty } from 'antd';
import ReactApexChart from 'react-apexcharts';

const { Title } = Typography;

const Budget = () => {
  const { summary } = useModel('itinerary');

  const chartData = [summary.totalFood, summary.totalTransport, summary.totalAcc];
  const totalItems = chartData.reduce((a, b) => a + b, 0);

  const series = totalItems > 0 ? chartData : [];
  
  const options = {
    chart: { type: 'donut' as const },
    labels: ['Ăn uống', 'Di chuyển', 'Lưu trú'],
    colors: ['#00E396', '#FEB019', '#008FFB'],
    legend: { position: 'bottom' as const },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        return Math.round(val) + "%";
      }
    },
    tooltip: {
      y: {
        formatter: function(value: number) {
          return value.toLocaleString() + ' VNĐ';
        }
      }
    }
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Quản lý ngân sách</Title>
      
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card title="Phân bổ ngân sách" style={{ height: '100%' }}>
            {totalItems > 0 ? (
              <ReactApexChart options={options} series={series} type="donut" height={350} />
            ) : (
              <Empty description="Lịch trình của bạn chưa có chi phí nào" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Budget;
