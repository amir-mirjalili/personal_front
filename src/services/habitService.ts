import api from './api';

export enum HabitDurationEnum {
  'DAILY' = 'DAILY',
  'WEAKLY' = 'WEAKLY',
  'MONTHLY' = 'MONTHLY',
}

export interface Habit {
  id: string;
  name: string;
  duration: HabitDurationEnum;
  description?: string;
  score: number;
  startDate: Date;
  endDate: Date;
  habitLogs: HabitLog[];
}

export interface HabitLog {
  id: string;
  date: Date;
  ticked: boolean;
  habitId: number;
}

export const habitService = {
  getAll: () => api.get<Habit[]>('/habits'),
  getById: (id: string) => api.get<Habit>(`/habits/${id}`),
  create: (data: Omit<Habit, 'id' | 'score' | 'habitLogs'>) =>
    api.post<Habit>('/habits', data),
  tick: (id: string, date: string) =>
    api.put<Habit>(`/habits/${id}/tick`, { date }),
  penalty: (id: string, date: string) =>
    api.put<Habit>(`/habits/${id}/penalty`, { date }),
};
