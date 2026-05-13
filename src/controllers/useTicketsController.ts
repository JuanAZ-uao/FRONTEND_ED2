import { useEffect, useState } from 'react';
import type { UserTicket } from '../services/user.service';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';

export const useTicketsController = () => {
  const session = authService.getSession();
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    userService
      .getMyTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = tickets.filter(
    (t) => new Date(t.ticketType.concert.date) >= new Date() && t.status !== 'CANCELLED'
  );
  const past = tickets.filter(
    (t) => new Date(t.ticketType.concert.date) < new Date() || t.status === 'CANCELLED'
  );

  return { session, tickets, upcoming, past, loading };
};
