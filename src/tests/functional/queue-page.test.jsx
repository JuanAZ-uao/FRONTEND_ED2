import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import QueuePage from '../../views/pages/QueuePage';

const cancelQueueMock = vi.fn();

const state = {
  eventId: '',
  tierId: '',
  quantity: 1,
  isPayloadValid: false,
  phase: 'idle',
  status: '',
  queuePosition: 0,
  queueEtaSeconds: 0,
  queueLength: 0,
  cancelQueue: cancelQueueMock,
};

vi.mock('../../controllers/useQueueController', () => ({
  useQueueController: () => state,
}));

describe('Functional - QueuePage', () => {
  test('shows empty state when purchase payload is missing', () => {
    Object.assign(state, {
      isPayloadValid: false,
      phase: 'idle',
      status: '',
      eventId: '',
      tierId: '',
      quantity: 1,
      queuePosition: 0,
      queueEtaSeconds: 0,
      queueLength: 0,
    });

    render(
      <MemoryRouter>
        <QueuePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/no hay compra activa/i)).toBeInTheDocument();
  });

  test('shows waiting status and allows leaving the queue', () => {
    cancelQueueMock.mockClear();

    Object.assign(state, {
      isPayloadValid: true,
      phase: 'waiting',
      status: 'Hay usuarios comprando. Te avisaremos cuando sea tu turno.',
      eventId: '9',
      tierId: '2',
      quantity: 3,
      queuePosition: 2,
      queueEtaSeconds: 180,
      queueLength: 4,
    });

    render(
      <MemoryRouter>
        <QueuePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/procesando tu turno/i)).toBeInTheDocument();
    expect(screen.getByText(/#2/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /salir de la cola/i }));
    expect(cancelQueueMock).toHaveBeenCalledTimes(1);
  });
});
