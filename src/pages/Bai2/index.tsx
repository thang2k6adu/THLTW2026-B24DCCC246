import React from 'react';
import { Space } from 'antd';
import KnowledgeBlockManager from './components/KnowledgeBlockManager';
import SubjectManager from './components/SubjectManager';

const Bai2Page = () => {
  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }} size="large">
      <SubjectManager />
      <KnowledgeBlockManager />
    </Space>
  );
};

export default Bai2Page;
