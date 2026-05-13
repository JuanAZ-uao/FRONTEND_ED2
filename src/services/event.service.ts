import { mockConcerts } from '../data/mockData';
import type { EventModel, Genre } from '../models/event.model';

const getPopularEvents = (): EventModel[] => mockConcerts;

const getEventBySlug = (slug: string): EventModel | undefined =>
  mockConcerts.find((event) => event.slug === slug);

const getByGenre = (genre: Genre | 'All'): EventModel[] => {
  if (genre === 'All') return mockConcerts;
  return mockConcerts.filter((event) => event.genre === genre);
};

const getFeatured = (): EventModel => mockConcerts[0];

export const eventService = {
  getPopularEvents,
  getEventBySlug,
  getByGenre,
  getFeatured,
};
