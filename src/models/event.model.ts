export type ConcertStatus = 'DRAFT' | 'PUBLISHED' | 'LIVE' | 'SOLD_OUT' | 'CANCELLED' | 'COMPLETED';

export const CONCERT_GENRES = ['Pop', 'Rock', 'Urban', 'Alternative', 'Electronic'] as const;
export type Genre = (typeof CONCERT_GENRES)[number];

export interface Artist {
  id: number;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  genres: string[];
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  imageUrl: string | null;
}

export interface TicketType {
  id: number;
  concertId: number;
  name: string;
  description: string | null;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
  maxPerOrder: number;
}

export interface Concert {
  id: number;
  artistId: number;
  tourName: string;
  description: string | null;
  date: string;
  doorsOpenAt: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  status: ConcertStatus;
  isFeatured: boolean;
  genres: string[];
  viewerCount: number;
  artist: Artist;
  venue: Venue;
  ticketTypes: TicketType[];
}

export const formatConcertDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year} - ${hours}:${minutes}`;
};

export const getSoldPercent = (ticketTypes: TicketType[]): number => {
  const total = ticketTypes.reduce((sum, t) => sum + t.totalQuantity, 0);
  const available = ticketTypes.reduce((sum, t) => sum + t.availableQuantity, 0);
  if (total === 0) return 0;
  return Math.round(((total - available) / total) * 100);
};
