import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Rate, Tag, Spin } from 'antd';
import { EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Discover = () => {
  const { destinations, loading, fetchDestinations } = useModel('destination');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'biển': return 'blue';
      case 'núi': return 'green';
      case 'thành phố': return 'purple';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Khám phá điểm đến</Title>
      
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          {destinations.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
                style={{ height: '100%' }}
                bodyStyle={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 200px)' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Title level={4} style={{ margin: 0, marginBottom: 8 }}>{item.name}</Title>
                    <Tag color={getTypeColor(item.type)}>{item.type.toUpperCase()}</Tag>
                  </div>
                  <Rate disabled defaultValue={item.rating} allowHalf style={{ fontSize: 14, marginBottom: 8 }} />
                  <Paragraph ellipsis={{ rows: 2 }}>{item.description}</Paragraph>
                </div>
                
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ marginBottom: 4 }}><EnvironmentOutlined /> <Text type="secondary">{item.location}</Text></div>
                  <div style={{ marginBottom: 4 }}><ClockCircleOutlined /> <Text type="secondary">{item.prepTime}</Text></div>
                  <div><DollarOutlined /> <Text strong>{item.priceLevel.toLocaleString()} VNĐ</Text></div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
};

export default Discover;
