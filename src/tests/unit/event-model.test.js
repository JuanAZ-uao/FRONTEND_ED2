import { describe, expect, test } from 'vitest';
import { formatConcertDate, getSoldPercent } from '../../models/event.model';

describe('Unit - event.model helpers', () => {
  test('getSoldPercent calculates sold percentage from ticket inventory', () => {
    const ticketTypes = [
      { totalQuantity: 100, availableQuantity: 40 },
      { totalQuantity: 50, availableQuantity: 10 },
    ];

    expect(getSoldPercent(ticketTypes)).toBe(67);
  });

  test('getSoldPercent returns 0 when total is zero', () => {
    expect(getSoldPercent([])).toBe(0);
  });

  test('formatConcertDate returns expected date label format', () => {
    const label = formatConcertDate('2026-05-13T18:30:00.000Z');

    expect(label).toMatch(/^\d{2} [A-Z]{3} \d{4} - \d{2}:\d{2}$/);
  });
});
