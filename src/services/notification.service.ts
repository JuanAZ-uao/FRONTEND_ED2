import { apiFetch } from './api.service';

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

const getAll = (): Promise<NotificationsResponse> =>
  apiFetch<NotificationsResponse>('/notifications');

const markRead = (id: number): Promise<void> =>
  apiFetch<void>(`/notifications/${id}/read`, { method: 'PATCH' });

const markAllRead = (): Promise<void> =>
  apiFetch<void>('/notifications/read-all', { method: 'PATCH' });

export const notificationService = { getAll, markRead, markAllRead };
