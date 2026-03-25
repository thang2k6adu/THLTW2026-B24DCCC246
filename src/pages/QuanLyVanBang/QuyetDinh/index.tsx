import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const QuyetDinhPage = () => {
  const { danhSach, loading, fetchDanhSach, add, update, remove } = useModel('quyetDinh');
  const { danhSach: danhSachSoVanBang, fetchDanhSach: fetchSoVanBang } = useModel('soVanBang');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDanhSach();
    fetchSoVanBang();
  }, [fetchDanhSach, fetchSoVanBang]);

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
    { title: 'Số QĐ', dataIndex: 'soQuyetDinh', key: 'soQuyetDinh' },
    { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh' },
    { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
    { 
      title: 'Sổ Văn Bằng', 
      dataIndex: 'idSoVanBang', 
      key: 'idSoVanBang',
      render: (idSVB: string) => {
        const svb = danhSachSoVanBang.find((s: any) => s.id === idSVB);
        return svb ? svb.tenSo : idSVB;
      }
    },
    { title: 'Lượt Tra Cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu' },
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
      title="Quản Lý Quyết Định Tốt Nghiệp" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table
        dataSource={danhSach}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
      
      <Modal 
        title={editingId ? 'Chỉnh sửa Quyết định' : 'Thêm Quyết định mới'} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="soQuyetDinh" label="Số QĐ" rules={[{ required: true, message: 'Vui lòng nhập số QĐ!' }]}>
            <Input placeholder="VD: 123/QĐ-PTIT" />
          </Form.Item>
          <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true, message: 'Vui lòng nhập ngày!' }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="trichYeu" label="Trích yếu">
            <Input.TextArea rows={2} placeholder="Nội dung trích yếu" />
          </Form.Item>
          <Form.Item name="idSoVanBang" label="Sổ Văn Bằng" rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}>
            <Select placeholder="Chọn sổ văn bằng">
              {danhSachSoVanBang.map((so: any) => (
                <Option key={so.id} value={so.id}>{so.tenSo}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuyetDinhPage;
