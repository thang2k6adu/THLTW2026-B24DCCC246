import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Card } from 'antd';
import { useModel } from 'umi';

const KnowledgeBlockManager = () => {
  const { knowledgeBlocks, loading, fetchKnowledgeBlocks, addKnowledgeBlock, editKnowledgeBlock, removeKnowledgeBlock } = useModel('exam');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchKnowledgeBlocks();
  }, []);

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({ name: record.name });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    if (editingId) {
      await editKnowledgeBlock(editingId, values.name);
    } else {
      await addKnowledgeBlock(values.name);
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
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
          <Button type="link" onClick={() => handleOpenModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa khối kiến thức này?" onConfirm={() => removeKnowledgeBlock(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Khối Kiến Thức" extra={<Button type="primary" onClick={() => handleOpenModal()}>Thêm mới</Button>}>
      <Table 
        dataSource={knowledgeBlocks} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        size="small"
      />

      <Modal
        title={editingId ? 'Sửa Khối Kiến Thức' : 'Thêm Khối Kiến Thức'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); setEditingId(null); }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Tên Khối Kiến Thức" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KnowledgeBlockManager;
