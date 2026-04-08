import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Card, Typography, Table, Button, Space, Popconfirm, Tag, Drawer, Form, Input, InputNumber, Select, message, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Admin = () => {
  const { destinations, loading, fetchDestinations, remove, create, update } = useModel('destination');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const openDrawer = (record?: any) => {
    setIsDrawerVisible(true);
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const expenses = {
      food: values.expensesFood || 0,
      transport: values.expensesTransport || 0,
      accommodation: values.expensesAccommodation || 0,
    };
    const payload = { ...values, expenses };

    let success;
    if (editingId) {
      success = await update({ ...payload, id: editingId });
    } else {
      success = await create(payload);
    }
    
    if (success) {
      message.success(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      closeDrawer();
    } else {
      message.error('Có lỗi xảy ra!');
    }
  };

  const columns = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Phân loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'default';
        if (type === 'biển') color = 'blue';
        if (type === 'núi') color = 'green';
        if (type === 'thành phố') color = 'purple';
        return <Tag color={color}>{type?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Mức giá (VNĐ)',
      dataIndex: 'priceLevel',
      key: 'priceLevel',
      render: (price: number) => price?.toLocaleString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => openDrawer({
            ...record,
            expensesFood: record.expenses?.food,
            expensesTransport: record.expenses?.transport,
            expensesAccommodation: record.expenses?.accommodation,
          })}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => remove(record.id)}>
            <Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản trị điểm đến</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>Thêm điểm đến</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng số điểm đến" value={destinations.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Điểm đến phổ biến nhất" value="Phố cổ Hội An" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lượt tạo lịch trình tháng này" value={142} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Doanh thu dự kiến" value={15200000} suffix="VNĐ" />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table 
          columns={columns} 
          dataSource={destinations} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title={editingId ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        width={720}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={closeDrawer}>Hủy</Button>
            <Button onClick={() => form.submit()} type="primary">
              Lưu lại
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="Vịnh Hạ Long" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Vị trí" rules={[{ required: true }]}>
                <Input placeholder="Quảng Ninh" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại hình">
                  <Select.Option value="biển">Biển</Select.Option>
                  <Select.Option value="núi">Núi</Select.Option>
                  <Select.Option value="thành phố">Thành phố</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priceLevel" label="Mức giá chung" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rating" label="Đánh giá (1-5)" rules={[{ required: true }]}>
                 <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="image" label="URL Hình ảnh (Upload)" rules={[{ required: true }]}>
                <Input addonBefore={<UploadOutlined />} placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={4} maxLength={255} />
              </Form.Item>
            </Col>
          </Row>
          
          <Title level={5}>Cấu hình ngân sách tham khảo</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="expensesFood" label="Ăn uống">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expensesTransport" label="Di chuyển">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expensesAccommodation" label="Lưu trú">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default Admin;
