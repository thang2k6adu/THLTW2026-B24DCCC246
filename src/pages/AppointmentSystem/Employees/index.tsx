import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Card, Modal, Form, Input, InputNumber, Space, Checkbox, TimePicker } from 'antd';
import moment from 'moment';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EmployeeManagement = () => {
  const { data, loading, fetch, add, update, remove } = useModel('bookingEmployees');
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { fetch(); }, []);

  const handleOpen = (record?: any) => {
    form.resetFields();
    if (record) {
      setEditingId(record.id);
      
      const formattedSchedule: any = {};
      if (typeof record.schedule === 'object' && record.schedule !== null) {
        for (const day of DAYS) {
          if (record.schedule[day]) {
            formattedSchedule[day] = {
              active: record.schedule[day].active,
              start: record.schedule[day].start ? moment(record.schedule[day].start, 'HH:mm') : null,
              end: record.schedule[day].end ? moment(record.schedule[day].end, 'HH:mm') : null,
            };
          }
        }
      } else {
        // Init default if simple string or missing
        for (const day of DAYS) {
          formattedSchedule[day] = { active: false, start: moment('08:00', 'HH:mm'), end: moment('17:00', 'HH:mm') };
        }
      }
      
      form.setFieldsValue({ ...record, schedule: formattedSchedule });
    } else {
      setEditingId(null);
      const defaultSchedule: any = {};
      for (const day of DAYS) {
        defaultSchedule[day] = { active: false, start: moment('08:00', 'HH:mm'), end: moment('17:00', 'HH:mm') };
      }
      form.setFieldsValue({ schedule: defaultSchedule });
    }
    setVisible(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    
    // Format schedule for saving
    const formattedSchedule: any = {};
    for (const day of DAYS) {
      if (vals.schedule && vals.schedule[day]) {
        formattedSchedule[day] = {
          active: vals.schedule[day].active,
          start: vals.schedule[day].start ? vals.schedule[day].start.format('HH:mm') : null,
          end: vals.schedule[day].end ? vals.schedule[day].end.format('HH:mm') : null,
        };
      }
    }
    const payload = { ...vals, schedule: formattedSchedule };

    if (editingId) {
      await update(editingId, payload);
    } else {
      await add(payload);
    }
    setVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Tên nhân viên', dataIndex: 'name' },
    { title: 'Số khách tối đa/ngày', dataIndex: 'maxCustomers' },
    { 
      title: 'Lịch làm việc', 
      dataIndex: 'schedule',
      render: (schedule: any) => {
        if (typeof schedule === 'string') return schedule;
        if (!schedule) return '';
        const activeDays = DAYS.filter(d => schedule[d]?.active);
        if (activeDays.length === 0) return 'Chưa có lịch';
        return activeDays.map(d => `${d}: ${schedule[d].start || '?'} - ${schedule[d].end || '?'}`).join(', ');
      }
    },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Space>
          <Button onClick={() => handleOpen(r)}>Sửa</Button>
          <Button danger onClick={() => remove(r.id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="Quản lý nhân viên">
      <Button type="primary" onClick={() => handleOpen()} style={{ marginBottom: 16 }}>Thêm mới</Button>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
      <Modal visible={visible} title={editingId ? 'Sửa' : 'Thêm'} onOk={handleSave} onCancel={() => setVisible(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên NV" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="maxCustomers" label="Khách tối đa" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item>
          <Form.Item label="Lịch làm việc">
            {DAYS.map(day => (
              <Space key={day} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item name={['schedule', day, 'active']} valuePropName="checked" noStyle>
                  <Checkbox style={{ width: 100 }}>{day}</Checkbox>
                </Form.Item>
                <Form.Item name={['schedule', day, 'start']} noStyle>
                  <TimePicker format="HH:mm" placeholder="Start" style={{ width: 100 }} />
                </Form.Item>
                <span> - </span>
                <Form.Item name={['schedule', day, 'end']} noStyle>
                  <TimePicker format="HH:mm" placeholder="End" style={{ width: 100 }} />
                </Form.Item>
              </Space>
            ))}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default EmployeeManagement;
