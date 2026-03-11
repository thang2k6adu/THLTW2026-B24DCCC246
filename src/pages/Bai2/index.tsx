import React from 'react';
import { Space } from 'antd';
import KnowledgeBlockManager from './components/KnowledgeBlockManager';
import SubjectManager from './components/SubjectManager';
import QuestionManager from './components/QuestionManager';
import ExamStructureManager from './components/ExamStructureManager';

const Bai2Page = () => {
  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }} size="large">
      <ExamStructureManager />
      <QuestionManager />
      <SubjectManager />
      <KnowledgeBlockManager />
    </Space>
  );
};

export default Bai2Page;
