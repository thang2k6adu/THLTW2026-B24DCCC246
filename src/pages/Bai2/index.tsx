import React from 'react';
import { Space, Typography, Row, Col } from 'antd';
import KnowledgeBlockManager from './components/KnowledgeBlockManager';
import SubjectManager from './components/SubjectManager';
import QuestionManager from './components/QuestionManager';
import ExamStructureManager from './components/ExamStructureManager';
import SavedExamsViewer from './components/SavedExamsViewer';

const { Title } = Typography;

const Bai2Page = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row justify="center">
        <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Heej thống quản lý ngân hàng câu hỏi</Title>
        </Col>
      </Row>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <SavedExamsViewer />
        <ExamStructureManager />
        <QuestionManager />
        <SubjectManager />
        <KnowledgeBlockManager />
      </Space>
    </div>
  );
};

export default Bai2Page;
