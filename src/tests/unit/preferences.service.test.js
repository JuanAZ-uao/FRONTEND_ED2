import { beforeEach, describe, expect, test } from 'vitest';
import { preferencesService } from '../../services/preferences.service';

const email = 'tester@example.com';
const storageKey = `concertix_preferences_${email.toLowerCase()}`;

describe('Unit - preferences.service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('savePreferencesByUser stores unique valid genres only', () => {
    preferencesService.savePreferencesByUser(email, ['Pop', 'Pop', 'Rock', 'Invalid']);

    expect(preferencesService.getPreferencesByUser(email)).toEqual(['Pop', 'Rock']);
  });

  test('getPreferencesByUser returns empty array for invalid JSON', () => {
    localStorage.setItem(storageKey, '{not-valid-json');

    expect(preferencesService.getPreferencesByUser(email)).toEqual([]);
  });
});
