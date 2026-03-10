import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, InputNumber, Card } from 'antd';
import { useModel } from 'umi';

const SubjectManager = () => {
  const { subjects, loading, fetchSubjects, addSubject, removeSubject } = useModel('exam');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = async (values: any) => {
    await addSubject(values);
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Mã Môn Học', dataIndex: 'subject_code', key: 'subject_code' },
    { title: 'Tên Môn Học', dataIndex: 'subject_name', key: 'subject_name' },
    { title: 'Số Tín Chỉ', dataIndex: 'credits', key: 'credits' },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm title="Xóa môn học này?" onConfirm={() => removeSubject(record.subject_code)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Môn Học" extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm mới</Button>}>
      <Table 
        dataSource={subjects} 
        columns={columns} 
        rowKey="subject_code" 
        loading={loading}
        size="small"
      />

      <Modal
        title="Thêm Môn Học"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="subject_code" label="Mã Môn Học" rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subject_name" label="Tên Môn Học" rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="credits" label="Số Tín Chỉ" rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SubjectManager;
