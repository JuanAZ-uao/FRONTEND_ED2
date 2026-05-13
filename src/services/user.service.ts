import type { AuthUser } from './auth.service';
import { apiFetch } from './api.service';

export interface TicketConcert {
  id: number;
  tourName: string;
  date: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  artist: { id: number; name: string; imageUrl: string | null };
  venue: { id: number; name: string; city: string };
}

export interface TicketSection {
  id: number;
  name: string;
  color: string | null;
}

export interface TicketTypeInfo {
  id: number;
  name: string;
  price: number;
  concert: TicketConcert;
  section: TicketSection | null;
}

export interface UserTicket {
  id: number;
  ticketCode: string;
  qrCode: string;
  seatLabel: string | null;
  row: string | null;
  status: string;
  createdAt: string;
  ticketType: TicketTypeInfo;
  order: { id: number; createdAt: string; totalAmount: number } | null;
}

export interface PaymentMethod {
  id: number;
  lastFour: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface NotifPrefs {
  id?: number;
  emailConcertsNearby: boolean;
  emailPurchaseConfirm: boolean;
  emailEventReminders: boolean;
  emailOffers: boolean;
  pushTicketUpdates: boolean;
  pushPriceAlerts: boolean;
  smsPurchaseConfirm: boolean;
  smsSecurityAlerts: boolean;
}

const getProfile = (): Promise<AuthUser> =>
  apiFetch<AuthUser>('/users/me');

const updateProfile = (data: Partial<Omit<AuthUser, 'id' | 'email' | 'role' | 'createdAt'>>): Promise<AuthUser> =>
  apiFetch<AuthUser>('/users/me', { method: 'PUT', body: JSON.stringify(data) });

const getMyTickets = (): Promise<UserTicket[]> =>
  apiFetch<UserTicket[]>('/users/me/tickets');

const getPaymentMethods = (): Promise<PaymentMethod[]> =>
  apiFetch<PaymentMethod[]>('/users/me/payment-methods');

const addPaymentMethod = (data: {
  lastFour: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isPrimary?: boolean;
}): Promise<PaymentMethod> =>
  apiFetch<PaymentMethod>('/users/me/payment-methods', { method: 'POST', body: JSON.stringify(data) });

const deletePaymentMethod = (id: number): Promise<void> =>
  apiFetch<void>(`/users/me/payment-methods/${id}`, { method: 'DELETE' });

const getNotifications = (): Promise<NotifPrefs> =>
  apiFetch<NotifPrefs>('/users/me/notifications');

const updateNotifications = (data: Partial<NotifPrefs>): Promise<NotifPrefs> =>
  apiFetch<NotifPrefs>('/users/me/notifications', { method: 'PUT', body: JSON.stringify(data) });

const changePassword = (currentPassword: string, newPassword: string): Promise<{ message: string }> =>
  apiFetch<{ message: string }>('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const userService = {
  getProfile,
  updateProfile,
  getMyTickets,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  getNotifications,
  updateNotifications,
  changePassword,
};
