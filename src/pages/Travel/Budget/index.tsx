import React from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Empty, InputNumber, Alert, Progress, Space } from 'antd';
import ReactApexChart from 'react-apexcharts';

const { Title, Text } = Typography;

const Budget = () => {
  const { summary, totalBudgetLimit, setTotalBudgetLimit } = useModel('itinerary');

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
      formatter: function (val: number) {
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
      
      {summary.totalCost > totalBudgetLimit && (
        <Alert
          message="Cảnh báo: Lịch trình của bạn đã vượt quá ngân sách thiết lập!"
          description={`Ngân sách của bạn là ${totalBudgetLimit.toLocaleString()} VNĐ nhưng hiện tại tổng chi phí ước tính là ${summary.totalCost.toLocaleString()} VNĐ.`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Space size="large" align="center" style={{ width: '100%' }}>
              <div>
                <Text strong>Ngân sách giới hạn: </Text>
                <InputNumber
                  style={{ width: 200 }}
                  value={totalBudgetLimit}
                  onChange={(val) => setTotalBudgetLimit(Number(val))}
                  addonAfter="VNĐ"
                  step={100000}
                />
              </div>
              <div style={{ flex: 1, minWidth: 300 }}>
                 <Progress 
                  percent={Math.min(100, (summary.totalCost / totalBudgetLimit) * 100)} 
                  status={summary.totalCost > totalBudgetLimit ? 'exception' : 'active'}
                  format={() => `${summary.totalCost.toLocaleString()} / ${totalBudgetLimit.toLocaleString()}`}
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

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
