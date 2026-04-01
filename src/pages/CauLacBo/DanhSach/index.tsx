import React, { useEffect } from 'react';
import { useModel, history } from 'umi';
import { Table, Card, Button, Avatar, Space, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';

const ClubList = () => {
  const { clubs, loading, fetchClubs, deleteClub } = useModel('club');

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text: string) => <Avatar src={text} size={48} />
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'establishedDate',
      key: 'establishedDate',
      sorter: (a: any, b: any) => new Date(a.establishedDate).getTime() - new Date(b.establishedDate).getTime(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (html: string) => (
        <div dangerouslySetInnerHTML={{ __html: html }} style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
      )
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
      key: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value: any, record: any) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Có' : 'Không'}</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" size="small">Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => deleteClub(record.id)}>
            <Button icon={<DeleteOutlined />} type="primary" danger size="small">Xóa</Button>
          </Popconfirm>
          <Button icon={<TeamOutlined />} size="small" onClick={() => history.push(`/cau-lac-bo/thanh-vien?clubId=${record.id}`)}>Thành viên</Button>
        </Space>
      )
    }
  ];

  return (
    <Card 
      title="Danh sách câu lạc bộ" 
      extra={<Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>}
    >
      <Table 
        dataSource={clubs}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default ClubList;
