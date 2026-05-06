import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Timeline, Typography } from 'antd';
import { FireOutlined, CalendarOutlined, TrophyOutlined, AimOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const { Title } = Typography;

const Dashboard = () => {
  const { data, fetchDashboardData } = useModel('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const barChartOptions: any = {
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'] },
    title: { text: 'Số buổi tập theo tuần (Tháng này)' }
  };

  const lineChartOptions: any = {
    chart: { type: 'line', height: 350 },
    xaxis: { type: 'datetime' },
    title: { text: 'Thay đổi cân nặng' }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng buổi tập (Tháng)" value={data.totalWorkouts} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Calo đã đốt" value={data.totalCalories} suffix="kcal" prefix={<FireOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Chuỗi (Streak)" value={data.streak} suffix="ngày" prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Mục tiêu hoàn thành" value={data.goalCompletion} suffix="%" prefix={<AimOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card>
            <ReactApexChart options={barChartOptions} series={data.workoutsByWeek} type="bar" height={350} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactApexChart options={lineChartOptions} series={data.weightOverTime} type="line" height={350} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="5 buổi tập gần nhất">
            <Timeline>
              {data.recentWorkouts.map((w: any) => (
                <Timeline.Item key={w.id} color={w.status === 'Completed' ? 'green' : 'red'}>
                  <strong>{moment(w.date).format('DD/MM/YYYY')}</strong>: {w.exerciseType} - {w.duration} phút ({w.calories} kcal)
                  <br/>
                  <em>{w.notes}</em>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
