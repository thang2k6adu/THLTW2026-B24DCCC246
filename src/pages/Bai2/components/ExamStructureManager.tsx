import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button, Space, Row, Col, Typography, message, Table, Tag } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;
const { Title, Text } = Typography;

const ExamStructureManager = () => {
  const { subjects, knowledgeBlocks, questions } = useModel('exam');
  const [form] = Form.useForm();
  
  // Dynamic generated structure representation (temporary state before submit)
  const [structure, setStructure] = useState<any>(null);
  
  // Generated Exam
  const [generatedExam, setGeneratedExam] = useState<any[]>([]);

  const handleGeneratePreview = (values: any) => {
    setStructure(values);
    
    // --- EXAM GENERATION LOGIC ---
    let examSet: any[] = [];
    let hasError = false;

    // Filter questions by subject
    const subjectQuestions = questions.filter(q => q.subject === values.subject);

    // Filter by Difficulty
    ['Dễ', 'Trung bình', 'Khó', 'Rất khó'].forEach(diff => {
      const required = values.difficulty[diff] || 0;
      if (required > 0) {
        const available = subjectQuestions.filter(q => q.difficulty === diff);
        if (available.length < required) {
          message.error(`Không đủ câu hỏi độ khó ${diff}. Cần ${required}, chỉ có ${available.length}.`);
          hasError = true;
        } else {
          // Random selection
          const shuffled = [...available].sort(() => 0.5 - Math.random());
          examSet = [...examSet, ...shuffled.slice(0, required)];
        }
      }
    });

    if (hasError) {
      setGeneratedExam([]);
      return;
    }

    // Filter by Knowledge Block
    Object.keys(values.knowledge_block).forEach(blockIdStr => {
      const blockId = Number(blockIdStr);
      const required = values.knowledge_block[blockIdStr] || 0;
      if (required > 0) {
        const available = subjectQuestions.filter(q => q.knowledge_block === blockId);
        if (available.length < required) {
          const blockName = knowledgeBlocks.find(b => b.id === blockId)?.name;
          message.error(`Không đủ câu hỏi thuộc khối ${blockName}. Cần ${required}, chỉ có ${available.length}.`);
          hasError = true;
        }
        // Note: For simplicity in this assignment, we overwrite constraints if they overlap, 
        // but normally we need a complex bipartite graph matching algorithm.
        // We will just do consecutive appending of questions satisfying block requirements.
        if (!hasError) {
           const shuffled = [...available].sort(() => 0.5 - Math.random());
           examSet = [...examSet, ...shuffled.slice(0, required)];
        }
      }
    });

    if (hasError) {
      setGeneratedExam([]);
      return;
    }

    // Remove duplicates recursively if elements got added twice due to naive constraint stacking
    const uniqueExamSet = Array.from(new Set(examSet.map(a => a.question_id)))
    .map(id => {
      return examSet.find(a => a.question_id === id)
    });

    setGeneratedExam(uniqueExamSet);
    message.success(`Sinh đề thi thành công với ${uniqueExamSet.length} câu hỏi!`);
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
