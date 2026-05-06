import React, { useMemo } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ProjectOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const Dashboard = () => {
  const { tasks } = useModel('kanban');

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'DONE').length;
    const overdue = tasks.filter(
      (t) => t.status !== 'DONE' && moment(t.deadline).isBefore(moment())
    ).length;

    return { total, completed, overdue };
  }, [tasks]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Dashboard Quản lý công việc</h1>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng số công việc"
              value={stats.total}
              prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Công việc hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Công việc quá hạn"
              value={stats.overdue}
              prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
