import { describe, expect, it } from 'vitest';
import { normalizePhoneNumber, SOCIAL_PROVIDER_LABELS } from './auth';

describe('normalizePhoneNumber', () => {
  it.each([
    ['923 123 456', '+244923123456'],
    ['923-123-456', '+244923123456'],
    ['0923 123 456', '+244923123456'],
    ['+244 923 123 456', '+244923123456'],
    ['00244 923 123 456', '+244923123456'],
    ['+351 910 000 000', '+351910000000'],
    ['00351 910 000 000', '+351910000000'],
  ])('normaliza %s como %s', (input, expected) => {
    expect(normalizePhoneNumber(input)).toBe(expected);
  });

  it.each(['', '   ', '123', '+0123456789', '+244-abc', '99999999999999999999'])('rejeita %j', (input) => {
    expect(normalizePhoneNumber(input)).toBeNull();
  });
});

describe('provedores sociais', () => {
  it('mantém os identificadores aceites pelos provedores OAuth', () => {
    expect(SOCIAL_PROVIDER_LABELS).toEqual({ google: 'Google', azure: 'Microsoft', apple: 'Apple' });
  });
});
