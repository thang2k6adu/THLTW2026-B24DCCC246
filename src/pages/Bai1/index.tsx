import React from 'react';
import { Typography, Row, Col } from 'antd';
import RockPaperScissors from './components/RockPaperScissors';

const { Title } = Typography;

const Bai1Page = () => {
  return (
    <div style={{ padding: 24 }}>
      <Row justify="center">
        <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>trò chơi oẳn tù tì</Title>
        </Col>
      </Row>
      <RockPaperScissors />
    </div>
  );
};

export default Bai1Page;
