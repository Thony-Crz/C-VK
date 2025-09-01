import { describe, it, expect } from 'vitest';
import { kmEffort, detectFormat } from '../src/core';
import { estimateCourse } from '../src/estimator';

describe('bords et régressions', () => {
  it('km-effort précision et éligibilité: 29.9 -> non; 30 -> oui', () => {
    expect(kmEffort(19.9, 1000)).toBeCloseTo(29.9, 6);
    const r1 = estimateCourse({ distanceKm: 19.9, dPlusM: 1000, sexe: 'H', categorie: 'SE', seasonId: '2025/26' });
    expect(r1.eligibleParcours).toBe(false);
    const r2 = estimateCourse({ distanceKm: 20, dPlusM: 1000, sexe: 'H', categorie: 'SE', seasonId: '2025/26' });
    expect(r2.kmEffort).toBe(30);
    expect(r2.eligibleParcours).toBe(true);
  });

  it('format: 59.99 -> court ; 60 -> long', () => {
    expect(detectFormat(59.99)).toBe('court');
    expect(detectFormat(60)).toBe('long');
  });
});

