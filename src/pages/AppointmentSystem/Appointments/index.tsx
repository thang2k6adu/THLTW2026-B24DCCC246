import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Card, Modal, Form, Select, DatePicker, TimePicker, Space, Tag, message } from 'antd';
import moment from 'moment';

const Appointments = () => {
  const { data, loading, fetch, book, changeStatus } = useModel('bookingAppointments');
  const { data: emps, fetch: fetchEmps } = useModel('bookingEmployees');
  const { data: svcs, fetch: fetchSvcs } = useModel('bookingServices');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { fetch(); fetchEmps(); fetchSvcs(); }, []);

  const handleSave = async () => {
    const vals = await form.validateFields();

    const selectedEmployee = emps.find(e => e.id === vals.employeeId);
    if (selectedEmployee && typeof selectedEmployee.schedule === 'object') {
      const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeekName = DAYS_OF_WEEK[vals.date.day()];
      const scheduleForDay = selectedEmployee.schedule[dayOfWeekName];

      if (!scheduleForDay || !scheduleForDay.active) {
        message.error(`Nhân viên không làm việc vào ngày ${dayOfWeekName}`);
        return;
      }

      const startTime = moment(scheduleForDay.start, 'HH:mm');
      const endTime = moment(scheduleForDay.end, 'HH:mm');
      const selectedTime = moment(vals.time.format('HH:mm'), 'HH:mm');

      if (selectedTime.isBefore(startTime) || selectedTime.isAfter(endTime)) {
        message.error(`Giờ hẹn (${vals.time.format('HH:mm')}) phải nằm trong ca làm việc: ${scheduleForDay.start} - ${scheduleForDay.end}`);
        return;
      }
    }

    // Overlap logic checked in backend, handling format bug
    const payload = {
      ...vals,
      date: vals.date.format('YYYY-MM-DD'),
      time: vals.time.format('HH:mm')
    };
    const success = await book(payload);
    if (success) setVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Ngày', dataIndex: 'date' },
    { title: 'Giờ', dataIndex: 'time' },
    { title: 'Trạng thái', dataIndex: 'status', render: (val: string) => <Tag>{val}</Tag> },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" onClick={() => changeStatus(r.id, 'confirmed')}>Xác nhận</Button>
          <Button size="small" onClick={() => changeStatus(r.id, 'completed')}>Hoàn thành</Button>
          <Button size="small" danger onClick={() => changeStatus(r.id, 'cancelled')}>Hủy</Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="Quản lý lịch hẹn">
      <Button type="primary" onClick={() => { form.resetFields(); setVisible(true); }} style={{ marginBottom: 16 }}>Đặt lịch</Button>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
      <Modal visible={visible} title="Đặt lịch hẹn" onOk={handleSave} onCancel={() => setVisible(false)}>
        <Form form={form} layout="horizontal" labelCol={{span: 6}} wrapperCol={{span: 18}}>
          <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
            <Select>{emps.map(e => <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
            <Select>{svcs.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker style={{width:'100%'}} /></Form.Item>
          <Form.Item name="time" label="Giờ" rules={[{ required: true }]}><TimePicker style={{width:'100%'}} format="HH:mm" /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default Appointments;
