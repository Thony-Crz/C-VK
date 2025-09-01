import { describe, it, expect } from 'vitest';
import { kmEffort } from '../src/core';

describe('kmEffort', () => {
  it('calcule distance + D+/100 (cas simple)', () => {
    // 42 km, 2000 m D+ => 42 + 20 = 62
    expect(kmEffort(42, 2000)).toBe(62);
  });

  it('gère D+ = 0', () => {
    expect(kmEffort(10, 0)).toBe(10);
  });

  it('valide les entrées (distance > 0, D+ >= 0)', () => {
    expect(() => kmEffort(0, 100)).toThrow();
    expect(() => kmEffort(-5, 100)).toThrow();
    expect(() => kmEffort(10, -1)).toThrow();
  });
});

