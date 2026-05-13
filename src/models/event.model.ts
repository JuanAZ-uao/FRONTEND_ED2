export type Genre = 'Pop' | 'Rock' | 'Urban' | 'Alternative' | 'Electronic';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  remaining: number;
  perks: string[];
}

export interface EventModel {
  id: number;
  slug: string;
  artist: string;
  title: string;
  dateLabel: string;
  city: string;
  venue: string;
  genre: Genre;
  rating: number;
  soldPercent: number;
  heroImage: string;
  posterImage: string;
  description: string;
  tags: string[];
  ticketTiers: TicketTier[];
}
