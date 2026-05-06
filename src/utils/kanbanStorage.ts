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

const INITIAL_MOCK_DATA: ITask[] = [
  {
    id: 'task-1',
    title: 'Thiết kế giao diện trang chủ',
    description: 'Tạo mockup và prototype cho trang chủ bằng Figma.',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
    priority: 'HIGH',
    status: 'TODO',
    tags: ['Design', 'UI/UX'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Nghiên cứu thư viện kéo thả',
    description: 'Tìm hiểu và so sánh react-beautiful-dnd, dnd-kit và react-dnd.',
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(), // +1 day
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    tags: ['Research', 'React'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Tích hợp API Authentication',
    description: 'Kết nối frontend với backend login/register APIs.',
    deadline: new Date(Date.now() - 86400000 * 1).toISOString(), // -1 day (overdue)
    priority: 'HIGH',
    status: 'TODO',
    tags: ['Frontend', 'API', 'Bug'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Thiết lập project base',
    description: 'Cấu hình Webpack, UmiJS, ESLint và Prettier cho dự án.',
    deadline: new Date(Date.now() - 86400000 * 3).toISOString(), // -3 days
    priority: 'HIGH',
    status: 'DONE',
    tags: ['Config', 'Setup'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Viết tài liệu Coding Guide',
    description: 'Hướng dẫn chuẩn code và commit convention cho team.',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // +5 days
    priority: 'LOW',
    status: 'IN_PROGRESS',
    tags: ['Documentation'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Tối ưu hóa hiệu năng render Kanban',
    description: 'Áp dụng React.memo và useMemo để giảm re-render.',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
    priority: 'MEDIUM',
    status: 'TODO',
    tags: ['Performance', 'React'],
    createdAt: new Date().toISOString(),
  },
];

export const getTasksFromStorage = (): ITask[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Save mock data initially
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
    const parsedData = JSON.parse(data);
    return parsedData.length > 0 ? parsedData : INITIAL_MOCK_DATA;
  } catch (error) {
    console.error('Failed to parse tasks from local storage', error);
    return INITIAL_MOCK_DATA;
  }
};

export const saveTasksToStorage = (tasks: ITask[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to local storage', error);
  }
};
