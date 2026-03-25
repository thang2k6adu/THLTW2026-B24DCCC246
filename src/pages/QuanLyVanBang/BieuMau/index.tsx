import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const BieuMauPage = () => {
  const { danhSach, loading, fetchDanhSach, add, update, remove } = useModel('bieuMau');
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
      let res;
      if (editingId) {
        res = await update(editingId, values);
        if (res.success) message.success('Cập nhật thành công');
      } else {
        res = await add(values);
        if (res.success) message.success('Thêm mới thành công');
      }
      if (res.success) setIsModalVisible(false);
      else message.error(res.message || 'Có lỗi xảy ra');
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await remove(id);
    if (res.success) message.success('Xóa thành công');
    else message.error(res.message || 'Xóa thất bại');
  };

  const columns = [
    { title: 'Tên trường', dataIndex: 'tenTruong', key: 'tenTruong' },
    { title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', key: 'kieuDuLieu' },
    { title: 'Key (mã)', dataIndex: 'key', key: 'key' },
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
      title="Cấu Hình Biểu Mẫu Trường Thông Tin Văn Bằng" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table
        dataSource={danhSach}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
      
      <Modal 
        title={editingId ? 'Chỉnh sửa trường' : 'Thêm trường mới'} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenTruong" label="Tên trường (Ví dụ: Dân tộc, Nơi sinh)" rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}>
            <Input placeholder="Nhập tên trường thông tin" />
          </Form.Item>
          <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu" rules={[{ required: true, message: 'Vui lòng chọn kiểu!' }]}>
            <Select placeholder="Chọn kiểu">
              <Option value="String">String (Văn bản)</Option>
              <Option value="Number">Number (Số)</Option>
              <Option value="Date">Date (Ngày tháng)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BieuMauPage;
