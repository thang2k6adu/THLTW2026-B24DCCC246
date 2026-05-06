import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Tag, Typography } from 'antd';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskFormModal from '@/components/TaskFormModal';
import { ETaskStatus, ITask } from '@/utils/kanbanStorage';
import styles from './index.less';

const { Text } = Typography;

const COLUMNS: { id: ETaskStatus; title: string; color: string }[] = [
  { id: 'TODO', title: 'Cần làm', color: '#1890ff' },
  { id: 'IN_PROGRESS', title: 'Đang làm', color: '#faad14' },
  { id: 'DONE', title: 'Hoàn thành', color: '#52c41a' },
];

const KanbanBoard = () => {
  const { tasks, addTask, updateTask, moveTask } = useModel('kanban');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>();

  const handleAddClick = () => {
    setEditingTask(undefined);
    setIsModalVisible(true);
  };

  const handleTaskClick = (task: ITask) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleModalSubmit = (values: any) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setIsModalVisible(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    moveTask(draggableId, destination.droppableId as ETaskStatus);
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.boardHeader}>
        <h1>Kanban Board</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm công việc
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.columnsContainer}>
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);

            return (
              <div key={column.id} className={styles.column}>
                <div className={styles.columnTitle}>
                  <span>
                    <span style={{ color: column.color, marginRight: 8 }}>●</span>
                    {column.title}
                  </span>
                  <Tag color={column.color} style={{ borderRadius: 10 }}>
                    {columnTasks.length}
                  </Tag>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      className={styles.taskList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${styles.taskCard} ${styles[`priority-${task.priority}`]}`}
                              onClick={() => handleTaskClick(task)}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <div className={styles.taskTitle}>{task.title}</div>
                              {task.deadline && (
                                <div className={styles.taskMeta}>
                                  <Text
                                    type={
                                      moment(task.deadline).isBefore(moment()) && task.status !== 'DONE'
                                        ? 'danger'
                                        : 'secondary'
                                    }
                                  >
                                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                                    {moment(task.deadline).format('DD/MM/YYYY')}
                                  </Text>
                                </div>
                              )}
                              {task.tags && task.tags.length > 0 && (
                                <div className={styles.tags}>
                                  {task.tags.map((tag) => (
                                    <Tag key={tag} color="blue" style={{ margin: 0 }}>
                                      {tag}
                                    </Tag>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <TaskFormModal
        visible={isModalVisible}
        title={editingTask ? 'Cập nhật công việc' : 'Thêm công việc mới'}
        initialValues={editingTask}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default KanbanBoard;
