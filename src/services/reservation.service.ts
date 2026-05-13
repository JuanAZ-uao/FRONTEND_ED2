import type { TicketReservation } from '../models/user.model';

const getStorageKey = (email: string) => `concertix_reservations_${email.toLowerCase()}`;

const getReservationsByUser = (email: string): TicketReservation[] => {
  const raw = localStorage.getItem(getStorageKey(email));
  if (!raw) return [];

  try {
    return JSON.parse(raw) as TicketReservation[];
  } catch {
    return [];
  }
};

const saveReservationsByUser = (email: string, reservations: TicketReservation[]) => {
  localStorage.setItem(getStorageKey(email), JSON.stringify(reservations));
};

const addReservation = (email: string, reservation: Omit<TicketReservation, 'id'>) => {
  const current = getReservationsByUser(email);

  const nextReservation: TicketReservation = {
    id: Date.now(),
    ...reservation,
  };

  saveReservationsByUser(email, [nextReservation, ...current]);
};

export const reservationService = {
  getReservationsByUser,
  saveReservationsByUser,
  addReservation,
};
