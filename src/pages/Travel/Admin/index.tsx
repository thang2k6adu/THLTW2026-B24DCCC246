import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Typography, Table, Button, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Admin = () => {
  const { destinations, loading, fetchDestinations, remove } = useModel('destination');

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

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
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Mức giá (VNĐ)',
      dataIndex: 'priceLevel',
      key: 'priceLevel',
      render: (price: number) => price.toLocaleString(),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" size="small" icon={<EditOutlined />}>Sửa</Button>
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
        <Button type="primary" icon={<PlusOutlined />}>Thêm điểm đến</Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={destinations} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Admin;
