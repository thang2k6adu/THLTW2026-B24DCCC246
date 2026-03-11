import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, Select, Card, Tag, Row, Col } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;

const QuestionManager = () => {
  const { questions, loading, fetchQuestions, addQuestion, removeQuestion, subjects, knowledgeBlocks } = useModel('exam');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Search States
  const [searchSubject, setSearchSubject] = useState<string | undefined>(undefined);
  const [searchDifficulty, setSearchDifficulty] = useState<string | undefined>(undefined);
  const [searchBlock, setSearchBlock] = useState<number | undefined>(undefined);

  const handleSearch = () => {
    fetchQuestions({
      subject: searchSubject,
      difficulty: searchDifficulty,
      knowledge_block: searchBlock
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleClear = () => {
    setSearchSubject(undefined);
    setSearchDifficulty(undefined);
    setSearchBlock(undefined);
    fetchQuestions();
  };

  const handleAdd = async (values: any) => {
    await addQuestion(values);
    setIsModalVisible(false);
    form.resetFields();
    handleSearch(); // Refresh with current filters
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Dễ': return 'success';
      case 'Trung bình': return 'processing';
      case 'Khó': return 'warning';
      case 'Rất khó': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Mã CH', dataIndex: 'question_id', key: 'question_id', width: 100 },
    { title: 'Môn học', dataIndex: 'subject', key: 'subject', width: 120 },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    { 
      title: 'Độ khó', 
      dataIndex: 'difficulty', 
      key: 'difficulty',
      width: 120,
      render: (val: string) => <Tag color={getDifficultyColor(val)}>{val}</Tag>
    },
    { 
      title: 'Khối KT', 
      dataIndex: 'knowledge_block', 
      key: 'knowledge_block',
      width: 120,
      render: (val: number) => {
        const block = knowledgeBlocks.find(b => b.id === val);
        return block ? block.name : val;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => removeQuestion(record.question_id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Ngân Hàng Câu Hỏi" extra={<Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm mới</Button>}>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select style={{ width: '100%' }} placeholder="Tìm theo môn học" allowClear value={searchSubject} onChange={setSearchSubject}>
              {subjects.map(s => <Option key={s.subject_code} value={s.subject_code}>{s.subject_code} - {s.subject_name}</Option>)}
            </Select>
          </Col>
          <Col span={6}>
            <Select style={{ width: '100%' }} placeholder="Tìm theo độ khó" allowClear value={searchDifficulty} onChange={setSearchDifficulty}>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select style={{ width: '100%' }} placeholder="Tìm theo khối kiến thức" allowClear value={searchBlock} onChange={setSearchBlock}>
              {knowledgeBlocks.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
              <Button onClick={handleClear}>Làm mới</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Table 
        dataSource={questions} 
        columns={columns} 
        rowKey="question_id" 
        loading={loading}
        size="small"
      />

      <Modal
        title="Thêm Câu Hỏi Mới"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="question_id" label="Mã Câu Hỏi" rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="subject" label="Môn Học" rules={[{ required: true, message: 'Chọn môn học!' }]}>
            <Select placeholder="Chọn môn">
              {subjects.map(s => <Option key={s.subject_code} value={s.subject_code}>{s.subject_code} - {s.subject_name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Nhập nội dung!' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="difficulty" label="Độ khó" rules={[{ required: true, message: 'Chọn độ khó!' }]}>
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>

          <Form.Item name="knowledge_block" label="Khối Kiến Thức" rules={[{ required: true, message: 'Chọn khối kiến thức!' }]}>
            <Select placeholder="Chọn khối">
              {knowledgeBlocks.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuestionManager;
