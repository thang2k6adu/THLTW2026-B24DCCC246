import React, { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Statistic } from 'antd';
import Chart from 'react-apexcharts';

const ReportDashboard = () => {
  const { clubs, fetchClubs } = useModel('club');
  const { registrations, fetchRegistrations } = useModel('registration');

  useEffect(() => {
    fetchClubs();
    fetchRegistrations();
  }, [fetchClubs, fetchRegistrations]);

  const stats = useMemo(() => {
    const totalClubs = clubs.length;
    let pending = 0, approved = 0, rejected = 0;
    
    registrations.forEach(r => {
      if (r.status === 'Pending') pending++;
      else if (r.status === 'Approved') approved++;
      else if (r.status === 'Rejected') rejected++;
    });

    return { totalClubs, pending, approved, rejected };
  }, [clubs, registrations]);

  // Aggregation for ColumnChart
  const chartData = useMemo(() => {
    const categories = clubs.map(c => c.name);
    
    const pendingData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Pending').length);
    const approvedData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Approved').length);
    const rejectedData = clubs.map(c => registrations.filter(r => r.clubId === c.id && r.status === 'Rejected').length);

    return {
      categories,
      series: [
        { name: 'Pending', data: pendingData },
        { name: 'Approved', data: approvedData },
        { name: 'Rejected', data: rejectedData }
      ]
    };
  }, [clubs, registrations]);

  const chartOptions: any = {
    chart: { type: 'bar', height: 400, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: chartData.categories },
    yaxis: { title: { text: 'Số lượng đơn' } },
    fill: { opacity: 1 },
    colors: ['#faad14', '#52c41a', '#ff4d4f'],
    tooltip: { y: { formatter: (val: number) => val + ' đơn' } }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng số CLB" value={stats.totalClubs} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đơn chờ duyệt" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Từ chối" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đã duyệt" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card title="Thống kê đơn đăng ký theo câu lạc bộ" style={{ marginTop: 24 }}>
        <Chart options={chartOptions} series={chartData.series} type="bar" height={400} />
      </Card>
    </div>
  );
};

export default ReportDashboard;
