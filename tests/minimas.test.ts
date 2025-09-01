import { describe, it, expect } from 'vitest';
import { getMinimaVK } from '../src/minimas';

describe('minimas lookup (2025/26)', () => {
  it('retourne la VK H Senior/ES: 4:10 min/km', () => {
    const vk = getMinimaVK('2025/26', 'H', 'SE');
    expect(vk).toBeCloseTo(4 + 10 / 60, 6);
    const vkEs = getMinimaVK('2025/26', 'H', 'ES');
    expect(vkEs).toBeCloseTo(4 + 10 / 60, 6);
  });

  it('retourne la VK F M2: 6:00 min/km', () => {
    const vk = getMinimaVK('2025/26', 'F', 'M2');
    expect(vk).toBeCloseTo(6, 6);
  });

  it('retourne null pour M5 à M10 (pas de minima)', () => {
    expect(getMinimaVK('2025/26', 'H', 'M5')).toBeNull();
    expect(getMinimaVK('2025/26', 'F', 'M8')).toBeNull();
  });
});

