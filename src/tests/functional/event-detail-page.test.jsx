import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import EventDetailPage from '../../views/pages/EventDetailPage';

vi.mock('../../controllers/useEventDetailController', () => ({
  useEventDetailController: () => ({
    loading: false,
    event: {
      id: 42,
      imageUrl: null,
      artist: { name: 'Test Artist' },
      tourName: 'Test Tour',
      description: 'Descripcion de prueba',
      date: '2026-06-20T20:00:00.000Z',
      venue: { city: 'Bogota', name: 'Movistar Arena' },
      genres: ['Pop'],
      ticketTypes: [
        { id: 1, name: 'General', availableQuantity: 100, price: 120000 },
        { id: 2, name: 'VIP', availableQuantity: 30, price: 240000 },
      ],
    },
    selectedTier: { id: 1, name: 'General', availableQuantity: 100, price: 120000 },
    selectedTierId: '1',
    setSelectedTierId: vi.fn(),
    quantity: 2,
    increaseQty: vi.fn(),
    decreaseQty: vi.fn(),
    subtotal: 240000,
  }),
}));

describe('Functional - EventDetailPage', () => {
  test('routes user to waiting-room queue with selected params', () => {
    render(
      <MemoryRouter>
        <EventDetailPage />
      </MemoryRouter>
    );

    const cta = screen.getByRole('link', { name: /continuar al pago/i });
    expect(cta).toHaveAttribute('href');
    expect(cta.getAttribute('href')).toContain('/queue?event=42&tier=1&qty=2');
  });
});
