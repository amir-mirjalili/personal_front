import api from './api';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  description?: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}

export const taskService = {
  getAll: (date?: string) => api.get<Task[]>(`/tasks/`, { params: { date } }),
  create: (data: Omit<Task, 'id' | 'category'>) =>
    api.post<Task>('/tasks', data),
};
