import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SoVanBangPage = () => {
  const { danhSach, loading, fetchDanhSach, add, update, remove } = useModel('soVanBang');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDanhSach();
  }, [fetchDanhSach]);

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let success = false;
      if (editingId) {
        success = await update(editingId, values);
        if (success) message.success('Cập nhật thành công');
      } else {
        success = await add(values);
        if (success) message.success('Thêm mới thành công');
      }
      if (success) setIsModalVisible(false);
      else message.error('Có lỗi xảy ra');
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await remove(id);
    if (success) message.success('Xóa thành công');
    else message.error('Xóa thất bại');
  };

  const columns = [
    { title: 'Tên Sổ', dataIndex: 'tenSo', key: 'tenSo' },
    { title: 'Năm', dataIndex: 'nam', key: 'nam' },
    { title: 'Số vào sổ tiếp theo', dataIndex: 'soVaoSoHienTai', key: 'soVaoSoHienTai' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Quản Lý Sổ Văn Bằng" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table
        dataSource={danhSach}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
      
      <Modal 
        title={editingId ? 'Chỉnh sửa sổ văn bằng' : 'Thêm sổ văn bằng mới'} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenSo" label="Tên Sổ" rules={[{ required: true, message: 'Vui lòng nhập tên sổ!' }]}>
            <Input placeholder="VD: Sổ cấp bằng 2026" />
          </Form.Item>
          <Form.Item name="nam" label="Năm" rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}>
            <InputNumber placeholder="VD: 2026" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SoVanBangPage;
