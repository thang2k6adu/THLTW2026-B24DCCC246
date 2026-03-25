import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Table, Card, Button, Modal, Form, Input, Select, Space, Popconfirm, message, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const ThongTinVanBangPage = () => {
  const { danhSach, loading, fetchDanhSach, add, update, remove } = useModel('vanBang');
  const { danhSach: dsQuyetDinh, fetchDanhSach: fetchQD } = useModel('quyetDinh');
  const { danhSach: dsBieuMau, fetchDanhSach: fetchBM } = useModel('bieuMau');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDanhSach();
    fetchQD();
    fetchBM();
  }, [fetchDanhSach, fetchQD, fetchBM]);

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
        if (success) {
            message.success('Thêm mới thành công');
        } else {
            message.error('Lỗi: Quyết định hoặc sổ không hợp lệ');
        }
      }
      if (success) setIsModalVisible(false);
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await remove(id);
    if (success) message.success('Xóa thành công');
    else message.error('Xóa thất bại');
  };

  // Base columns
  const baseColumns = [
    { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
    { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang' },
    { title: 'Mã SV', dataIndex: 'maSinhVien', key: 'maSinhVien' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
    { 
      title: 'Quyết Định', 
      dataIndex: 'idQuyetDinh', 
      key: 'idQuyetDinh',
      render: (val: string) => {
        const qd = dsQuyetDinh.find((q: any) => q.id === val);
        return qd ? qd.soQuyetDinh : val;
      }
    },
  ];

  // Dynamic columns based on bieu mau
  const dynamicColumns = dsBieuMau.map((bm: any) => ({
    title: bm.tenTruong,
    dataIndex: bm.key,
    key: bm.key,
  }));

  const actionColumn = {
    title: 'Thao tác',
    key: 'action',
    fixed: 'right' as const,
    render: (_: any, record: any) => (
      <Space size="middle">
        <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>
        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        </Popconfirm>
      </Space>
    ),
  };

  const columns = [...baseColumns, ...dynamicColumns, actionColumn];

  return (
    <Card 
      title="Quản Lý Thông Tin Văn Bằng" 
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm mới</Button>}
    >
      <Table
        dataSource={danhSach}
        columns={columns}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1500 }}
      />
      
      <Modal 
        title={editingId ? 'Chỉnh sửa Văn Bằng' : 'Thêm Văn Bằng mới'} 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true }]} style={{ width: '45%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[{ required: true }]} style={{ width: '45%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]} style={{ width: '45%' }}>
              <Input />
            </Form.Item>
            <Form.Item name="ngaySinh" label="Ngày sinh (Mặc định)" rules={[{ required: true }]} style={{ width: '45%' }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="idQuyetDinh" label="Quyết định tốt nghiệp" rules={[{ required: true }]} style={{ width: '45%' }}>
              <Select placeholder="Chọn quyết định">
                {dsQuyetDinh.map((q: any) => (
                  <Option key={q.id} value={q.id}>{q.soQuyetDinh}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <h3>Thông tin bổ sung (theo biểu mẫu)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {dsBieuMau.map((bm: any) => (
              <Form.Item 
                key={bm.key} 
                name={bm.key} 
                label={bm.tenTruong} 
                style={{ width: '45%' }}
              >
                {bm.kieuDuLieu === 'Number' ? (
                  <InputNumber style={{ width: '100%' }} />
                ) : bm.kieuDuLieu === 'Date' ? (
                  <Input type="date" style={{ width: '100%' }} />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default ThongTinVanBangPage;
