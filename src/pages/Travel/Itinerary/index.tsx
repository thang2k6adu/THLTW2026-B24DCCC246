import { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Button, List, Dropdown, Menu, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Itinerary = () => {
  const { destinations, fetchDestinations } = useModel('destination');
  const { days, addDay, removeDay, addDestinationToDay, removeDestinationFromDay, save, saving } = useModel('itinerary');

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const renderDestMenu = (dest: any) => (
    <Menu>
      {days.map((day: any, dIdx: number) => (
        <Menu.Item key={day.day} onClick={() => addDestinationToDay(dIdx, dest)}>
          Thêm vào Ngày {day.day}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Lập lịch trình</Title>
        <Button type="primary" onClick={save} loading={saving}>Lưu Lịch Trình</Button>
      </Row>

      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card title="Khám phá điểm đến" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <List
              itemLayout="horizontal"
              dataSource={destinations}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Dropdown key="add" overlay={renderDestMenu(item)} trigger={['click']}>
                      <Button icon={<PlusOutlined />} size="small" />
                    </Dropdown>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.priceLevel.toLocaleString()} VNĐ - ${item.prepTime}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card 
            title="Lịch trình của bạn" 
            extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addDay}>Thêm ngày</Button>}
            style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', background: '#f0f2f5' }}
          >
            {days.map((dayPlan: any, dayIdx: number) => (
              <Card 
                key={dayPlan.day} 
                title={`Ngày ${dayPlan.day}`} 
                style={{ marginBottom: 16 }}
                extra={
                  <Popconfirm title="Xóa ngày này?" onConfirm={() => removeDay(dayIdx)}>
                    <Button danger icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>
                }
              >
                <List
                  dataSource={dayPlan.destinations}
                  locale={{ emptyText: 'Chưa có điểm đến nào. Hãy thêm từ danh sách bên trái!' }}
                  renderItem={(dest: any, destIdx: number) => (
                    <List.Item
                      actions={[
                        <Button key="remove" danger type="text" icon={<DeleteOutlined />} onClick={() => removeDestinationFromDay(dayIdx, destIdx)} />
                      ]}
                    >
                      <List.Item.Meta
                        title={dest.name}
                        description={dest.type.toUpperCase()}
                      />
                      <div>{dest.priceLevel.toLocaleString()} VNĐ</div>
                    </List.Item>
                  )}
                />
              </Card>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Itinerary;
