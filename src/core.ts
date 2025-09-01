export function kmEffort(distanceKm: number, dPlusM: number): number {
  if (!(Number.isFinite(distanceKm)) || !(Number.isFinite(dPlusM))) {
    throw new Error('Entrées invalides');
  }
  if (distanceKm <= 0) {
    throw new Error('La distance doit être > 0');
  }
  if (dPlusM < 0) {
    throw new Error('Le D+ doit être >= 0');
  }
  return distanceKm + dPlusM / 100;
}

export type Format = 'court' | 'long';

export function detectFormat(kmEffortValue: number): Format {
  return kmEffortValue >= 60 ? 'long' : 'court';
}
