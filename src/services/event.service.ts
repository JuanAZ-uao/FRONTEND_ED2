import type { Concert } from '../models/event.model';
import { apiFetch } from './api.service';

const getAll = (params?: { city?: string; genre?: string; status?: string }): Promise<Concert[]> => {
  const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
  return apiFetch<Concert[]>(`/concerts${query}`);
};

const getFeatured = (): Promise<Concert[]> =>
  apiFetch<Concert[]>('/concerts?isFeatured=true');

const getById = (id: number): Promise<Concert> =>
  apiFetch<Concert>(`/concerts/${id}`);

const search = (q: string): Promise<Concert[]> =>
  apiFetch<Concert[]>(`/concerts/search?q=${encodeURIComponent(q)}`);

const getRelated = (id: number): Promise<Concert[]> =>
  apiFetch<Concert[]>(`/concerts/${id}/related`);

export const eventService = {
  getAll,
  getFeatured,
  getById,
  search,
  getRelated,
};
