import { describe, it, expect } from 'vitest';
import { estimateCourse } from '../src/estimator';

// L'allure cible à plat doit être: temps_cible_min / distance_km
// Ex A: 42k/2000m, kmE=62, VK=4'10 (4.1667) -> temps ≈ 258 min
// Allure à plat ≈ 258 / 42 ≈ 6.142857 min/km (~ 6:09/km)

describe('Allure équivalente à plat', () => {
  it('calcule l’allure à plat depuis le temps cible et la distance', () => {
    const res = estimateCourse({
      distanceKm: 42,
      dPlusM: 2000,
      sexe: 'H',
      categorie: 'SE',
      seasonId: '2025/26'
    });
    // Vérifie cohérence: allure à plat = temps cible / distance
    expect(res.allureAPlatMinPerKm).toBeCloseTo((res.tempsCibleMinutes as number) / 42, 6);
  });

  it('retourne null si pas de minima (M7)', () => {
    const res = estimateCourse({
      distanceKm: 30,
      dPlusM: 0,
      sexe: 'H',
      categorie: 'M7',
      seasonId: '2025/26'
    });
    expect(res.allureAPlatMinPerKm).toBeNull();
  });
});
