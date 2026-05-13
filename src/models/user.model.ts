export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  city: string;
  memberSince: string;
  preferredGenres: string[];
}

export interface TicketReservation {
  id: number;
  eventName: string;
  eventDate: string;
  venue: string;
  quantity: number;
  amountPaid: number;
  status: 'CONFIRMED' | 'PENDING';
}
