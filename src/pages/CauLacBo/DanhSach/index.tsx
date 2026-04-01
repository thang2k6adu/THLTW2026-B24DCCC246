import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { Table, Card, Button, Avatar, Space, Tag, Popconfirm, Modal, Form, Input, Switch, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';

const ClubList = () => {
  const { clubs, loading, fetchClubs, addClub, updateClub, deleteClub } = useModel('club');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [form] = Form.useForm();

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
      // added simple text search placeholder if we need filtering logic later, 
      // but standard antd table filter setup can be done if required.
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
          <Button 
            icon={<EditOutlined />} 
            type="primary" 
            size="small"
            onClick={() => {
              setEditingClub(record);
              form.setFieldsValue({
                ...record,
                establishedDate: record.establishedDate ? moment(record.establishedDate) : null
              });
              setIsModalVisible(true);
            }}
          >Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => deleteClub(record.id)}>
            <Button icon={<DeleteOutlined />} type="primary" danger size="small">Xóa</Button>
          </Popconfirm>
          <Button icon={<TeamOutlined />} size="small" onClick={() => history.push(`/cau-lac-bo/thanh-vien?clubId=${record.id}`)}>Thành viên</Button>
        </Space>
      )
    }
  ];

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        id: editingClub?.id || Math.random().toString(36).substr(2, 9),
        establishedDate: values.establishedDate ? values.establishedDate.format('YYYY-MM-DD') : '',
      };
      
      if (editingClub) {
        await updateClub(editingClub.id, payload);
      } else {
        await addClub(payload);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card 
        title="Danh sách câu lạc bộ" 
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingClub(null);
          form.resetFields();
          form.setFieldsValue({ isActive: true });
          setIsModalVisible(true);
        }}>Thêm mới</Button>}
      >
        <Table 
          dataSource={clubs}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingClub ? 'Sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar" label="URL Ảnh đại diện" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="president" label="Chủ nhiệm" rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="establishedDate" label="Ngày thành lập" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (HTML)">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ClubList;
