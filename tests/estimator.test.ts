import { describe, it, expect } from 'vitest';
import { estimateCourse } from '../src/estimator';

describe('estimateCourse - cas d’usage', () => {
  it('Ex. A (long) Senior H 42k/2000m => ~258 min et format long', () => {
    const res = estimateCourse({
      distanceKm: 42,
      dPlusM: 2000,
      sexe: 'H',
      categorie: 'SE',
      seasonId: '2025/26'
    });
    expect(res.kmEffort).toBe(62);
    expect(res.formatCalcule).toBe('long');
    expect(res.vkCibleMinPerKm).toBeCloseTo(4 + 10 / 60, 6);
    expect(res.tempsCibleMinutes).toBeCloseTo(258, 0); // ~258 min
    expect(res.vitesseMoyKmH).toBeCloseTo(60 / (4 + 10 / 60), 6);
  });

  it('Ex. B (court) M2 F 28k/1000m => 228 min et format court', () => {
    const res = estimateCourse({
      distanceKm: 28,
      dPlusM: 1000,
      sexe: 'F',
      categorie: 'M2',
      seasonId: '2025/26'
    });
    expect(res.kmEffort).toBe(38);
    expect(res.formatCalcule).toBe('court');
    expect(res.vkCibleMinPerKm).toBeCloseTo(6, 6);
    expect(res.tempsCibleMinutes).toBeCloseTo(228, 6);
  });

  it('Ex. C (M7) => pas de minima, terminer suffit', () => {
    const res = estimateCourse({
      distanceKm: 28,
      dPlusM: 1000,
      sexe: 'H',
      categorie: 'M7',
      seasonId: '2025/26'
    });
    expect(res.vkCibleMinPerKm).toBeNull();
    expect(res.requiresFinishOnly).toBe(true);
    expect(res.tempsCibleMinutes).toBeNull();
    expect(res.vitesseMoyKmH).toBeNull();
  });

  it('éligibilité: avertit si km-effort < 30', () => {
    const res = estimateCourse({
      distanceKm: 10,
      dPlusM: 1000,
      sexe: 'H',
      categorie: 'SE',
      seasonId: '2025/26'
    });
    expect(res.kmEffort).toBe(20);
    expect(res.eligibleParcours).toBe(false);
    expect(res.warnings.some(w => /non éligible/i.test(w))).toBe(true);
  });

  it('avertit si format demandé ≠ calculé', () => {
    const res = estimateCourse({
      distanceKm: 42,
      dPlusM: 2000,
      sexe: 'H',
      categorie: 'SE',
      seasonId: '2025/26',
      requestedFormat: 'court'
    });
    expect(res.formatCalcule).toBe('long');
    expect(res.warnings.some(w => /format demandé/i.test(w))).toBe(true);
  });
});

