import { useEffect, useMemo, useState } from 'react';
import type { Genre } from '../models/event.model';
import { authService } from '../services/auth.service';
import { preferencesService } from '../services/preferences.service';
import { reservationService } from '../services/reservation.service';

export const useDashboardController = () => {
  const session = authService.getSession();
  const userEmail = session?.user.email ?? '';

  const [preferredGenres, setPreferredGenres] = useState<Genre[]>([]);

  useEffect(() => {
    if (!userEmail) {
      setPreferredGenres([]);
      return;
    }

    setPreferredGenres(preferencesService.getPreferencesByUser(userEmail));
  }, [userEmail]);

  const savePreferredGenres = (genres: Genre[]) => {
    if (!userEmail) return;
    preferencesService.savePreferencesByUser(userEmail, genres);
    setPreferredGenres(genres);
  };

  const reservations = useMemo(() => {
    if (!session) return [];
    return reservationService.getReservationsByUser(session.user.email);
  }, [session]);

  const profile = useMemo(() => {
    if (!session) return null;

    return {
      id: 1,
      fullName: session.user.fullName,
      email: session.user.email,
      city: 'Sin ciudad',
      memberSince: `${new Date().getFullYear()}`,
      preferredGenres,
    };
  }, [preferredGenres, session]);

  const stats = useMemo(() => {
    const totalSpent = reservations.reduce((acc, item) => acc + item.amountPaid, 0);
    const confirmed = reservations.filter((item) => item.status === 'CONFIRMED').length;

    return {
      totalTickets: reservations.reduce((acc, item) => acc + item.quantity, 0),
      totalSpent,
      confirmed,
    };
  }, [reservations]);

  return {
    session,
    profile,
    reservations,
    stats,
    savePreferredGenres,
  };
};
