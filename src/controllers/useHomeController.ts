import { useMemo, useState } from 'react';
import type { Genre } from '../models/event.model';
import { authService } from '../services/auth.service';
import { eventService } from '../services/event.service';
import { preferencesService } from '../services/preferences.service';

export type HomeGenre = Genre | 'All';

const genres: HomeGenre[] = ['All', 'Pop', 'Rock', 'Urban', 'Alternative', 'Electronic'];

export const useHomeController = () => {
  const [activeGenre, setActiveGenre] = useState<HomeGenre>('All');
  const session = authService.getSession();
  const userEmail = session?.user.email ?? '';

  const events = useMemo(() => eventService.getByGenre(activeGenre), [activeGenre]);
  const featured = useMemo(() => eventService.getFeatured(), []);
  const preferredGenres = useMemo(() => {
    if (!userEmail) return [] as Genre[];
    return preferencesService.getPreferencesByUser(userEmail);
  }, [userEmail]);

  const preferredEvents = useMemo(() => {
    if (preferredGenres.length === 0) return [];
    return eventService
      .getPopularEvents()
      .filter((event) => preferredGenres.includes(event.genre));
  }, [preferredGenres]);

  return {
    genres,
    activeGenre,
    setActiveGenre,
    events,
    featured,
    preferredGenres,
    preferredEvents,
  };
};
