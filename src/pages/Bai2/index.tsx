import React from 'react';
import { Space } from 'antd';
import KnowledgeBlockManager from './components/KnowledgeBlockManager';

const Bai2Page = () => {
  return (
    <Space direction="vertical" style={{ width: '100%', padding: 24 }} size="large">
      <KnowledgeBlockManager />
    </Space>
  );
};

export default Bai2Page;
