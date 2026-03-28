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

describe('minimas lookup (2026/27)', () => {
  it('retourne la VK H Senior: 3:45 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'SE');
    expect(vk).toBeCloseTo(3 + 45 / 60, 6);
  });

  it('retourne la VK F Senior: 4:45 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'SE');
    expect(vk).toBeCloseTo(4 + 45 / 60, 6);
  });

  it('retourne la VK H U23/ES: 3:55 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'ES');
    expect(vk).toBeCloseTo(3 + 55 / 60, 6);
  });

  it('retourne la VK F U23/ES: 4:55 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'ES');
    expect(vk).toBeCloseTo(4 + 55 / 60, 6);
  });

  it('retourne la VK H M0: 3:55 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M0');
    expect(vk).toBeCloseTo(3 + 55 / 60, 6);
  });

  it('retourne la VK F M0: 4:55 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M0');
    expect(vk).toBeCloseTo(4 + 55 / 60, 6);
  });

  it('retourne la VK H M1: 4:10 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M1');
    expect(vk).toBeCloseTo(4 + 10 / 60, 6);
  });

  it('retourne la VK F M1: 5:15 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M1');
    expect(vk).toBeCloseTo(5 + 15 / 60, 6);
  });

  it('retourne la VK H M2: 4:20 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M2');
    expect(vk).toBeCloseTo(4 + 20 / 60, 6);
  });

  it('retourne la VK F M2: 5:30 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M2');
    expect(vk).toBeCloseTo(5 + 30 / 60, 6);
  });

  it('retourne la VK H M3: 4:30 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M3');
    expect(vk).toBeCloseTo(4 + 30 / 60, 6);
  });

  it('retourne la VK F M3: 5:50 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M3');
    expect(vk).toBeCloseTo(5 + 50 / 60, 6);
  });

  it('retourne la VK H M4: 4:45 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M4');
    expect(vk).toBeCloseTo(4 + 45 / 60, 6);
  });

  it('retourne la VK F M4: 6:15 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M4');
    expect(vk).toBeCloseTo(6 + 15 / 60, 6);
  });

  it('retourne la VK H M5: 5:05 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M5');
    expect(vk).toBeCloseTo(5 + 5 / 60, 6);
  });

  it('retourne la VK F M5: 7:00 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M5');
    expect(vk).toBeCloseTo(7, 6);
  });

  it('retourne la VK H M6: 5:25 min/km', () => {
    const vk = getMinimaVK('2026/27', 'H', 'M6');
    expect(vk).toBeCloseTo(5 + 25 / 60, 6);
  });

  it('retourne la VK F M6: 7:30 min/km', () => {
    const vk = getMinimaVK('2026/27', 'F', 'M6');
    expect(vk).toBeCloseTo(7 + 30 / 60, 6);
  });

  it('retourne null pour M7 à M10 (pas de minima)', () => {
    expect(getMinimaVK('2026/27', 'H', 'M7')).toBeNull();
    expect(getMinimaVK('2026/27', 'F', 'M10')).toBeNull();
  });
});

