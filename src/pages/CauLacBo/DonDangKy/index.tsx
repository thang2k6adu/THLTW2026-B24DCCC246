import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Space, Tag, Popconfirm, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const RegistrationList = () => {
  const { registrations, loading, fetchRegistrations, addRegistration, updateRegistration, deleteRegistration, updateStatus } = useModel('registration');
  const { clubs, fetchClubs } = useModel('club');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReg, setEditingReg] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'Approved' | 'Rejected'>('Approved');
  const [selectedReg, setSelectedReg] = useState<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchRegistrations();
    fetchClubs();
  }, [fetchRegistrations, fetchClubs]);

  const columns = [
    { title: 'Họ tên', dataIndex: 'candidateName', key: 'candidateName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubId', 
      key: 'clubId',
      render: (clubId: string) => clubs.find((c: any) => c.id === clubId)?.name || clubId
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => {
            setEditingReg(record);
            form.setFieldsValue(record);
            setIsViewMode(true);
            setIsModalVisible(true);
          }}>Xem</Button>
          {record.status === 'Pending' && (
            <>
              <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => {
                setSelectedReg(record);
                setActionType('Approved');
                form.setFieldsValue({ reasonNote: '' });
                setStatusModalVisible(true);
              }}>Duyệt</Button>
              <Button type="primary" danger size="small" onClick={() => {
                setSelectedReg(record);
                setActionType('Rejected');
                form.setFieldsValue({ reasonNote: '' });
                setStatusModalVisible(true);
              }}>Từ chối</Button>
            </>
          )}
          <Button icon={<EditOutlined />} type="primary" size="small" onClick={() => {
            setEditingReg(record);
            form.setFieldsValue(record);
            setIsViewMode(false);
            setIsModalVisible(true);
          }}>Sửa</Button>
          <Popconfirm title="Xóa đơn này?" onConfirm={() => deleteRegistration(record.id)}>
            <Button icon={<DeleteOutlined />} type="primary" danger size="small">Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleSubmit = async () => {
    if (isViewMode) {
      setIsModalVisible(false);
      return;
    }
    try {
      const values = await form.validateFields();
      if (editingReg) {
        await updateRegistration(editingReg.id, values);
      } else {
        await addRegistration(values);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
    }
  };

  return (
    <>
      <Card title="Quản lý đơn đăng ký" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => {
        setIsViewMode(false);
        setEditingReg(null);
        form.resetFields();
        setIsModalVisible(true);
      }}>Thêm mới</Button>}>
        <Table dataSource={registrations} columns={columns} rowKey="id" loading={loading} />
      </Card>
      
      <Modal title={isViewMode ? 'Chi tiết đơn đăng ký' : editingReg ? 'Sửa đơn' : 'Thêm đơn mới'} visible={isModalVisible} onOk={handleSubmit} onCancel={() => setIsModalVisible(false)} destroyOnClose>
        <Form form={form} layout="vertical" disabled={isViewMode}>
          <Form.Item name="candidateName" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input type="email" /></Form.Item>
          <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
          <Form.Item name="gender" label="Giới tính"><Select options={[{ label: 'Nam', value: 'Nam' }, { label: 'Nữ', value: 'Nữ' }, { label: 'Khác', value: 'Khác' }]} /></Form.Item>
          <Form.Item name="address" label="Địa chỉ"><Input /></Form.Item>
          <Form.Item name="strengths" label="Sở trường"><Input.TextArea /></Form.Item>
          <Form.Item name="clubId" label="Câu lạc bộ đăng ký" rules={[{ required: true }]}><Select options={clubs.map((c: any) => ({ label: c.name, value: c.id }))} /></Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      <Modal 
        title={actionType === 'Approved' ? 'Duyệt đơn đăng ký' : 'Từ chối đơn đăng ký'} 
        visible={statusModalVisible} 
        onOk={async () => {
          try {
            const values = await form.validateFields(['reasonNote']);
            await updateStatus(selectedReg.id, actionType, values.reasonNote || '');
            setStatusModalVisible(false);
            form.resetFields(['reasonNote']);
          } catch (e) {}
        }} 
        onCancel={() => setStatusModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="reasonNote" 
            label={actionType === 'Rejected' ? 'Lý do từ chối (bắt buộc)' : 'Ghi chú (tùy chọn)'}
            rules={[{ required: actionType === 'Rejected', message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RegistrationList;
