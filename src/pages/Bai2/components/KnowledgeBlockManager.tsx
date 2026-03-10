import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Card } from 'antd';
import { useModel } from 'umi';

const KnowledgeBlockManager = () => {
  const { knowledgeBlocks, loading, fetchKnowledgeBlocks, addKnowledgeBlock, removeKnowledgeBlock } = useModel('exam');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchKnowledgeBlocks();
  }, []);

  const handleAdd = async (values: any) => {
    await addKnowledgeBlock(values.name);
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên Khối Kiến Thức', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm title="Xóa khối kiến thức này?" onConfirm={() => removeKnowledgeBlock(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Khối Kiến Thức" extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm mới</Button>}>
      <Table 
        dataSource={knowledgeBlocks} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        size="small"
      />

      <Modal
        title="Thêm Khối Kiến Thức"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Tên Khối Kiến Thức" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KnowledgeBlockManager;
