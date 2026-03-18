import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import * as api from '@/services/Booking/statistics';

const Stats = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Read from localStorage to aggregate statistics
    const appointmentsStr = localStorage.getItem('bookingAppointments');
    const servicesStr = localStorage.getItem('bookingServices');
    const employeesStr = localStorage.getItem('bookingEmployees');

    const appointments = appointmentsStr ? JSON.parse(appointmentsStr) : [];
    const services = servicesStr ? JSON.parse(servicesStr) : [];
    const employees = employeesStr ? JSON.parse(employeesStr) : [];

    // Aggregate appointments per day
    const appointmentsPerDay: Record<string, number> = {};
    appointments.forEach((a: any) => {
      if (a.date) {
        appointmentsPerDay[a.date] = (appointmentsPerDay[a.date] || 0) + 1;
      }
    });

    // Aggregate revenue by service
    const revenueByService: Record<number, number> = {};
    appointments.forEach((a: any) => {
      // assuming confirmed or completed statuses count towards revenue
      if (a.status !== 'cancelled' && a.status !== 'pending') {
        const service = services.find((s: any) => s.id === a.serviceId);
        if (service && service.price) {
          revenueByService[a.serviceId] = (revenueByService[a.serviceId] || 0) + Number(service.price);
        }
      }
    });

    setData({
      appointmentsPerDay,
      revenueByService,
    });
  }, []);

  if (!data) return null;

  return (
    <Card title="Thống kê báo cáo">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng lịch hẹn" value={Object.values(data.appointmentsPerDay).reduce((a: any, b: any) => a+b, 0) as number} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng doanh thu DV" value={Object.values(data.revenueByService).reduce((a: any, b: any) => a+b, 0) as number} />
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
