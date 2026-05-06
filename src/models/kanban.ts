import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { ITask, getTasksFromStorage, saveTasksToStorage, ETaskStatus } from '@/utils/kanbanStorage';

export default () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    const storedTasks = getTasksFromStorage();
    setTasks(storedTasks);
    setLoading(false);
  }, []);

  // Sync to local storage whenever tasks change
  useEffect(() => {
    if (!loading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, loading]);

  const addTask = useCallback((task: Omit<ITask, 'id' | 'createdAt'>) => {
    const newTask: ITask = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    message.success('Thêm công việc thành công');
  }, []);

  const updateTask = useCallback((id: string, updatedFields: Partial<ITask>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
    );
    message.success('Cập nhật công việc thành công');
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    message.success('Xóa công việc thành công');
  }, []);

  const moveTask = useCallback((id: string, newStatus: ETaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
};
