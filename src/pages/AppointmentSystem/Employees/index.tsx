import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Card, Modal, Form, Input, InputNumber, Space } from 'antd';

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
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
    }
    setVisible(true);
  };

  const handleSave = async () => {
    const vals = await form.validateFields();
    if (editingId) {
      await update(editingId, vals);
    } else {
      await add(vals);
    }
    setVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Tên nhân viên', dataIndex: 'name' },
    { title: 'Số khách tối đa/ngày', dataIndex: 'maxCustomers' },
    { title: 'Lịch làm việc', dataIndex: 'schedule' },
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
      <Modal visible={visible} title={editingId ? 'Sửa' : 'Thêm'} onOk={handleSave} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên NV" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="maxCustomers" label="Khách tối đa" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item>
          <Form.Item name="schedule" label="Lịch (Vd: Thứ 2: 8h-17h)" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default EmployeeManagement;
