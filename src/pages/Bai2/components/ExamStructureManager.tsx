import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button, Space, Row, Col, Typography, message } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;
const { Title, Text } = Typography;

const ExamStructureManager = () => {
  const { subjects, knowledgeBlocks } = useModel('exam');
  const [form] = Form.useForm();
  
  // Dynamic generated structure representation (temporary state before submit)
  const [structure, setStructure] = useState<any>(null);

  const handleGeneratePreview = (values: any) => {
    // Basic structure preview validation
    setStructure(values);
    message.success('Đã lưu cấu trúc đề tạm thời. Bạn có thể sinh đề từ cấu trúc này.');
  };

  return (
    <Card title="Cấu trúc Đề thi">
      <Form form={form} layout="vertical" onFinish={handleGeneratePreview}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="subject" label="Môn Học" rules={[{ required: true, message: 'Chọn môn học!' }]}>
              <Select placeholder="Chọn môn thi">
                {subjects.map(s => <Option key={s.subject_code} value={s.subject_code}>{s.subject_code} - {s.subject_name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Title level={5}>Số lượng câu hỏi theo độ khó</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name={['difficulty', 'Dễ']} label="Dễ" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['difficulty', 'Trung bình']} label="Trung bình" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['difficulty', 'Khó']} label="Khó" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['difficulty', 'Rất khó']} label="Rất khó" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5}>Số lượng câu hỏi theo Khối Kiến Thức</Title>
        <Row gutter={16}>
          {knowledgeBlocks.map(block => (
            <Col span={8} key={block.id}>
              <Form.Item name={['knowledge_block', block.id]} label={block.name} initialValue={0}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Lưu cấu trúc tạm thời</Button>
            <Button htmlType="button" onClick={() => { form.resetFields(); setStructure(null); }}>Làm mới cấu trúc</Button>
          </Space>
        </Form.Item>
      </Form>

      {structure && (
        <Card type="inner" title="Cấu trúc Đã Định Nghĩa" style={{ marginTop: 16 }}>
          <Text strong>Môn thi:</Text> {structure.subject} <br />
          <Text strong>Cấu trúc độ khó:</Text> {JSON.stringify(structure.difficulty)} <br />
          <Text strong>Cấu trúc phân bổ kiến thức:</Text> {JSON.stringify(structure.knowledge_block)}
        </Card>
      )}
    </Card>
  );
};

export default ExamStructureManager;
