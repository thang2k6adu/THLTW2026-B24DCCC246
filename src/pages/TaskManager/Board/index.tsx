import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Tag, Typography } from 'antd';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
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
  const { tasks, addTask, updateTask } = useModel('kanban');
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

  return (
    <div className={styles.boardContainer}>
      <div className={styles.boardHeader}>
        <h1>Kanban Board</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm công việc
        </Button>
      </div>

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

              <div className={styles.taskList}>
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`${styles.taskCard} ${styles[`priority-${task.priority}`]}`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className={styles.taskTitle}>{task.title}</div>
                    {task.deadline && (
                      <div className={styles.taskMeta}>
                        <Text type={moment(task.deadline).isBefore(moment()) && task.status !== 'DONE' ? 'danger' : 'secondary'}>
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
                ))}
              </div>
            </div>
          );
        })}
      </div>

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
