import type { EventModel } from '../models/event.model';
import type { TicketReservation, UserProfile } from '../models/user.model';

export const mockConcerts: EventModel[] = [
  {
    id: 1,
    slug: 'doja-cat-neon-wave',
    artist: 'Doja Cat',
    title: 'NEON WAVE TOUR',
    dateLabel: '24 JUN 2026 - 20:00',
    city: 'Bogota',
    venue: 'Movistar Arena',
    genre: 'Pop',
    rating: 4.9,
    soldPercent: 82,
    heroImage:
      'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1400&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    description:
      'Una experiencia audiovisual con escenografia futurista, visuales inmersivas y setlist de alto impacto.',
    tags: ['Top Seller', 'Visual Show', 'VIP Experience'],
    ticketTiers: [
      { id: 'd1', name: 'General', price: 180000, remaining: 120, perks: ['Ingreso general'] },
      { id: 'd2', name: 'Preferencial', price: 290000, remaining: 74, perks: ['Vista central', 'Fila rapida'] },
      { id: 'd3', name: 'VIP', price: 520000, remaining: 21, perks: ['Zona exclusiva', 'Merch oficial'] },
    ],
  },
  {
    id: 2,
    slug: 'coldplay-color-sky',
    artist: 'Coldplay',
    title: 'COLOR SKY LIVE',
    dateLabel: '12 JUL 2026 - 21:00',
    city: 'Medellin',
    venue: 'Estadio Atanasio Girardot',
    genre: 'Rock',
    rating: 4.8,
    soldPercent: 77,
    heroImage:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80',
    description:
      'Concierto de estadio con pulseras sincronizadas y recorrido por los clasicos mas icónicos de la banda.',
    tags: ['Estadio', 'Familia', 'Sing Along'],
    ticketTiers: [
      { id: 'c1', name: 'Norte', price: 160000, remaining: 310, perks: ['Ingreso rapido'] },
      { id: 'c2', name: 'Oriental', price: 260000, remaining: 180, perks: ['Vista premium'] },
      { id: 'c3', name: 'Experience', price: 480000, remaining: 35, perks: ['Kit luminoso', 'Acceso preferente'] },
    ],
  },
  {
    id: 3,
    slug: 'rosalia-moto-heart',
    artist: 'Rosalia',
    title: 'MOTO HEART STAGE',
    dateLabel: '02 AGO 2026 - 19:30',
    city: 'Cali',
    venue: 'Arena Canaveralejo',
    genre: 'Urban',
    rating: 4.7,
    soldPercent: 71,
    heroImage:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1400&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=80',
    description:
      'Performance experimental con fusion de flamenco, beats urbanos y una direccion artistica cinematica.',
    tags: ['Trend', 'Coreografia', 'Visual Lab'],
    ticketTiers: [
      { id: 'r1', name: 'General', price: 140000, remaining: 210, perks: ['Acceso base'] },
      { id: 'r2', name: 'Front Stage', price: 310000, remaining: 66, perks: ['Zona cercana'] },
      { id: 'r3', name: 'Platinum', price: 460000, remaining: 18, perks: ['Lounge', 'Gift pack'] },
    ],
  },
  {
    id: 4,
    slug: 'bad-bunny-solar-season',
    artist: 'Bad Bunny',
    title: 'SOLAR SEASON',
    dateLabel: '20 AGO 2026 - 20:30',
    city: 'Barranquilla',
    venue: 'Estadio Metropolitano',
    genre: 'Urban',
    rating: 5,
    soldPercent: 93,
    heroImage:
      'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1400&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80',
    description:
      'Show de alto voltaje con invitados especiales, visuales tropicales y una produccion de nivel internacional.',
    tags: ['Sold Fast', 'Headliner', 'Mega Show'],
    ticketTiers: [
      { id: 'b1', name: 'General', price: 220000, remaining: 140, perks: ['Ingreso general'] },
      { id: 'b2', name: 'Cancha VIP', price: 380000, remaining: 38, perks: ['Zona frente escenario'] },
      { id: 'b3', name: 'Backstage', price: 750000, remaining: 9, perks: ['Meet and greet', 'Merch exclusivo'] },
    ],
  },
  {
    id: 5,
    slug: 'billie-eilish-nocturna',
    artist: 'Billie Eilish',
    title: 'NOCTURNA TOUR',
    dateLabel: '11 SEP 2026 - 20:00',
    city: 'Bogota',
    venue: 'Coliseo Live',
    genre: 'Alternative',
    rating: 4.6,
    soldPercent: 65,
    heroImage:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&w=1000&q=80',
    description:
      'Atmósfera intimista, estética oscura y diseño sonoro envolvente en un formato de show conceptual.',
    tags: ['Moody', 'Alternative', 'Immersive Audio'],
    ticketTiers: [
      { id: 'e1', name: 'General', price: 170000, remaining: 198, perks: ['Ingreso estandar'] },
      { id: 'e2', name: 'Lateral Plus', price: 240000, remaining: 102, perks: ['Vista mejorada'] },
      { id: 'e3', name: 'Front Gold', price: 420000, remaining: 24, perks: ['Zona premium'] },
    ],
  },
  {
    id: 6,
    slug: 'kendrick-lamar-city-poets',
    artist: 'Kendrick Lamar',
    title: 'CITY POETS LIVE',
    dateLabel: '03 OCT 2026 - 21:30',
    city: 'Medellin',
    venue: 'Plaza Mayor',
    genre: 'Urban',
    rating: 4.9,
    soldPercent: 79,
    heroImage:
      'https://images.unsplash.com/photo-1464375117522-1311dd7d5b5f?auto=format&fit=crop&w=1400&q=80',
    posterImage:
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1000&q=80',
    description:
      'Narrativa en vivo con banda completa, visuales de ciudad y setlist centrado en hip hop contemporaneo.',
    tags: ['Live Band', 'Lyric Experience', 'Hip Hop'],
    ticketTiers: [
      { id: 'k1', name: 'General', price: 190000, remaining: 170, perks: ['Ingreso general'] },
      { id: 'k2', name: 'Pista', price: 330000, remaining: 84, perks: ['Zona preferencial'] },
      { id: 'k3', name: 'Diamond', price: 560000, remaining: 16, perks: ['Acceso premium', 'Kit exclusivo'] },
    ],
  },
];

export const mockUser: UserProfile = {
  id: 1,
  fullName: 'Samuel Rios',
  email: 'samuel@ejemplo.com',
  city: 'Bogota',
  memberSince: '2024',
  preferredGenres: ['Urban', 'Pop', 'Alternative'],
};

export const mockReservations: TicketReservation[] = [
  {
    id: 101,
    eventName: 'NEON WAVE TOUR',
    eventDate: '24 JUN 2026',
    venue: 'Movistar Arena',
    quantity: 2,
    amountPaid: 580000,
    status: 'CONFIRMED',
  },
  {
    id: 102,
    eventName: 'SOLAR SEASON',
    eventDate: '20 AGO 2026',
    venue: 'Estadio Metropolitano',
    quantity: 1,
    amountPaid: 380000,
    status: 'PENDING',
  },
];
