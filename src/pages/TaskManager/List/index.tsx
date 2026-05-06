import React, { useState } from 'react';
import { useModel } from 'umi';
import { Table, Button, Tag, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import TaskFormModal from '@/components/TaskFormModal';
import { ITask } from '@/utils/kanbanStorage';

const STATUS_MAP: Record<string, { text: string; color: string }> = {
  TODO: { text: 'Cần làm', color: '#1890ff' },
  IN_PROGRESS: { text: 'Đang làm', color: '#faad14' },
  DONE: { text: 'Hoàn thành', color: '#52c41a' },
};

const PRIORITY_MAP: Record<string, { text: string; color: string }> = {
  HIGH: { text: 'Cao', color: '#ff4d4f' },
  MEDIUM: { text: 'Trung bình', color: '#faad14' },
  LOW: { text: 'Thấp', color: '#52c41a' },
};

const TaskList = () => {
  const { tasks, addTask, updateTask, deleteTask } = useModel('kanban');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>();

  const handleAddClick = () => {
    setEditingTask(undefined);
    setIsModalVisible(true);
  };

  const handleEditClick = (task: ITask) => {
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

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={STATUS_MAP[status]?.color}>{STATUS_MAP[status]?.text}</Tag>
      ),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={PRIORITY_MAP[priority]?.color}>{PRIORITY_MAP[priority]?.text}</Tag>
      ),
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => (deadline ? moment(deadline).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: ITask) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEditClick(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa công việc này?"
            onConfirm={() => deleteTask(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, backgroundColor: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách công việc</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Thêm công việc
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

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

export default TaskList;
