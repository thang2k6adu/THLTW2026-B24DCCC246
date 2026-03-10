import React from 'react';
import { Card, Button, Space, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

const RockPaperScissors = () => {
  return (
    <Card style={{ margin: 24 }} title="Trò chơi Oẳn Tù Tì">
      <Row justify="center" align="middle" gutter={32}>
        <Col span={10} style={{ textAlign: 'center' }}>
          <Title level={4}>Người chơi</Title>
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9', borderRadius: 8, marginBottom: 16 }}>
            <Text type="secondary">Chưa chọn</Text>
          </div>
          <Space>
            <Button size="large">Kéo ✌️</Button>
            <Button size="large">Búa ✊</Button>
            <Button size="large">Bao ✋</Button>
          </Space>
        </Col>
        
        <Col span={4} style={{ textAlign: 'center' }}>
          <Title level={2}>VS</Title>
        </Col>
        
        <Col span={10} style={{ textAlign: 'center' }}>
          <Title level={4}>Máy tính</Title>
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9', borderRadius: 8, marginBottom: 16 }}>
            <Text type="secondary">Đang chờ...</Text>
          </div>
        </Col>
      </Row>
      
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Title level={3} type="success">Kết quả sẽ hiển thị ở đây</Title>
      </div>
    </Card>
  );
};

export default RockPaperScissors;
