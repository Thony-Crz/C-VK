import { describe, it, expect } from 'vitest';
import { minPerKmToPaceStr } from '../src/core';

describe('minPerKmToPaceStr', () => {
  it('formate 4.1666… en 4:10', () => {
    const vk = 4 + 10 / 60; // 4'10
    expect(minPerKmToPaceStr(vk)).toBe('4:10');
  });

  it('formate 6.0 en 6:00', () => {
    expect(minPerKmToPaceStr(6)).toBe('6:00');
  });

  it('arrondit correctement les secondes (> .5 ⇒ +1s)', () => {
    const vk = 4 + 9.6 / 60; // 4'09.6 ≈ 4:10
    expect(minPerKmToPaceStr(vk)).toBe('4:10');
  });

  it('gère le report 4:59.6 ⇒ 5:00', () => {
    const vk = 4 + 59.6 / 60; // 4'59.6 → 5:00
    expect(minPerKmToPaceStr(vk)).toBe('5:00');
  });
});

