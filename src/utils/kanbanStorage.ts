export type ETaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type ETaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ITask {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO String
  priority: ETaskPriority;
  status: ETaskStatus;
  tags: string[];
  createdAt: string; // ISO String
}

const STORAGE_KEY = 'kanban_tasks';

export const getTasksFromStorage = (): ITask[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse tasks from local storage', error);
    return [];
  }
};

export const saveTasksToStorage = (tasks: ITask[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to local storage', error);
  }
};
