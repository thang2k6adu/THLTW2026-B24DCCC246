import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Card, Modal, Form, Input, InputNumber, Space } from 'antd';

const ServiceManagement = () => {
  const { data, loading, fetch, add, update, remove } = useModel('bookingServices');
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
    { title: 'Tên dịch vụ', dataIndex: 'name' },
    { title: 'Giá (VND)', dataIndex: 'price' },
    { title: 'Thời gian (phút)', dataIndex: 'duration' },
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
    <Card title="Quản lý dịch vụ">
      <Button type="primary" onClick={() => handleOpen()} style={{ marginBottom: 16 }}>Thêm mới</Button>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />
      <Modal visible={visible} title={editingId ? 'Sửa' : 'Thêm'} onOk={handleSave} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên DV" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item>
          <Form.Item name="duration" label="Thời gian" rules={[{ required: true }]}><InputNumber style={{width: '100%'}} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
export default ServiceManagement;
