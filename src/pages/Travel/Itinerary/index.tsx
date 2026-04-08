import { useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Typography, Button, List, Dropdown, Menu, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Title } = Typography;

const Itinerary = () => {
  const { destinations, fetchDestinations } = useModel('destination');
  const { 
    days, addDay, removeDay, addDestinationToDay, removeDestinationFromDay, 
    reorderDestination, moveDestinationBetweenDays, save, saving 
  } = useModel('itinerary');

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

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sDayIdx = parseInt(source.droppableId.replace('day-', ''));
    const dDayIdx = parseInt(destination.droppableId.replace('day-', ''));

    if (sDayIdx === dDayIdx) {
      reorderDestination(sDayIdx, source.index, destination.index);
    } else {
      moveDestinationBetweenDays(sDayIdx, dDayIdx, source.index, destination.index);
    }
  };

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
          <DragDropContext onDragEnd={onDragEnd}>
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
                  <Droppable droppableId={`day-${dayIdx}`}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 50 }}>
                        {dayPlan.destinations.length === 0 && (
                          <div style={{ padding: 16, textAlign: 'center', color: '#999' }}>
                            Chưa có điểm đến nào. Hãy thêm từ danh sách bên trái!
                          </div>
                        )}
                        {dayPlan.destinations.map((dest: any, destIdx: number) => (
                          <Draggable key={`${dayPlan.day}-${dest.id}-${destIdx}`} draggableId={`${dayPlan.day}-${dest.id}-${destIdx}`} index={destIdx}>
                            {(providedDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                style={{
                                  ...providedDrag.draggableProps.style,
                                  marginBottom: 8,
                                  padding: 12,
                                  background: '#fff',
                                  border: '1px solid #f0f0f0',
                                  borderRadius: 4,
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div {...providedDrag.dragHandleProps} style={{ cursor: 'grab' }}>
                                    <DragOutlined style={{ color: '#999' }} />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 'bold' }}>{dest.name}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>{dest.type.toUpperCase()} - {dest.priceLevel.toLocaleString()} VNĐ</div>
                                  </div>
                                </div>
                                <Button key="remove" danger type="text" icon={<DeleteOutlined />} onClick={() => removeDestinationFromDay(dayIdx, destIdx)} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              ))}
            </Card>
          </DragDropContext>
        </Col>
      </Row>
    </div>
  );
};

export default Itinerary;
