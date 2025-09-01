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

/**
 * Convertit une allure en minutes/kilomètre (nombre décimal) en chaîne mm:ss.
 * Exemple: 4.1666 → "4:10" ; 6 → "6:00" ; 4.993 → "4:60" → "5:00" (report).
 */
export function minPerKmToPaceStr(minPerKm: number): string {
  if (!Number.isFinite(minPerKm) || minPerKm < 0) return '—';
  const minutes = Math.floor(minPerKm);
  const secFloat = (minPerKm - minutes) * 60;
  let seconds = Math.round(secFloat);
  let minOut = minutes;
  if (seconds === 60) {
    minOut += 1;
    seconds = 0;
  }
  const ss = String(seconds).padStart(2, '0');
  return `${minOut}:${ss}`;
}
