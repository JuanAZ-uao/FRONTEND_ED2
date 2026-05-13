import { CONCERT_GENRES, type Genre } from '../models/event.model';

const AVAILABLE_GENRES: Genre[] = [...CONCERT_GENRES];

const getStorageKey = (email: string) => `concertix_preferences_${email.toLowerCase()}`;

const getPreferencesByUser = (email: string): Genre[] => {
  const raw = localStorage.getItem(getStorageKey(email));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((genre): genre is Genre => AVAILABLE_GENRES.includes(genre as Genre));
  } catch {
    return [];
  }
};

const savePreferencesByUser = (email: string, preferences: Genre[]) => {
  const unique = [...new Set(preferences)].filter((genre) => AVAILABLE_GENRES.includes(genre));
  localStorage.setItem(getStorageKey(email), JSON.stringify(unique));
};

export const preferencesService = {
  getPreferencesByUser,
  savePreferencesByUser,
};
