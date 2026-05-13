import { useEffect, useMemo, useState } from 'react';
import { CONCERT_GENRES, type Concert, type Genre } from '../models/event.model';
import { authService } from '../services/auth.service';
import { eventService } from '../services/event.service';
import { preferencesService } from '../services/preferences.service';

export type HomeGenre = 'All' | Genre;

const genres: HomeGenre[] = ['All', ...CONCERT_GENRES];

export const useHomeController = () => {
  const [activeGenre, setActiveGenre] = useState<HomeGenre>('All');
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    eventService
      .getAll()
      .then(setConcerts)
      .catch(() => setConcerts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(() => concerts.find((c) => c.isFeatured) ?? concerts[0] ?? null, [concerts]);

  const events = useMemo(
    () =>
      activeGenre === 'All'
        ? concerts
        : concerts.filter((c) => c.genres.includes(activeGenre)),
    [concerts, activeGenre]
  );

  const session = authService.getSession();
  const userEmail = session?.user.email ?? '';

  const preferredGenres = useMemo(() => {
    if (!userEmail) return [] as Genre[];
    return preferencesService.getPreferencesByUser(userEmail);
  }, [userEmail]);

  const preferredEvents = useMemo(() => {
    if (preferredGenres.length === 0) return [] as Concert[];
    return concerts.filter((c) => c.genres.some((g) => preferredGenres.includes(g as Genre)));
  }, [concerts, preferredGenres]);

  return {
    genres,
    activeGenre,
    setActiveGenre,
    events,
    featured,
    loading,
    preferredGenres,
    preferredEvents,
  };
};
