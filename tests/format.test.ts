import { describe, it, expect } from 'vitest';
import { detectFormat } from '../src/core';

describe('detectFormat', () => {
  it('retourne "court" si km-effort < 60', () => {
    expect(detectFormat(59.99)).toBe('court');
    expect(detectFormat(0)).toBe('court');
  });

  it('retourne "long" si km-effort >= 60', () => {
    expect(detectFormat(60)).toBe('long');
    expect(detectFormat(62)).toBe('long');
  });
});

