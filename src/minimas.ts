export type Sexe = 'H' | 'F';
export type Categorie =
  | 'ES' // Espoirs
  | 'SE' // Seniors
  | 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8' | 'M9' | 'M10';

export interface MinimaEntry {
  seasonId: string; // ex: '2025/26'
  sexe: Sexe;
  categorie: Categorie;
  // Minima en minutes par km (min/km). Absent pour M5+ (pas de minima => terminer suffit)
  vkMinMinPerKm?: number;
}

const toMin = (m: number, s: number) => m + s / 60;

// Table de base — saison 2025/26 (configurable ultérieurement)
const MINIMAS_2025_26: MinimaEntry[] = [
  // Espoirs / Seniors
  { seasonId: '2025/26', sexe: 'H', categorie: 'ES', vkMinMinPerKm: toMin(4, 10) },
  { seasonId: '2025/26', sexe: 'H', categorie: 'SE', vkMinMinPerKm: toMin(4, 10) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'ES', vkMinMinPerKm: toMin(5, 20) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'SE', vkMinMinPerKm: toMin(5, 20) },

  // M0
  { seasonId: '2025/26', sexe: 'H', categorie: 'M0', vkMinMinPerKm: toMin(4, 30) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M0', vkMinMinPerKm: toMin(5, 40) },
  // M1
  { seasonId: '2025/26', sexe: 'H', categorie: 'M1', vkMinMinPerKm: toMin(4, 50) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M1', vkMinMinPerKm: toMin(5, 50) },
  // M2
  { seasonId: '2025/26', sexe: 'H', categorie: 'M2', vkMinMinPerKm: toMin(5, 0) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M2', vkMinMinPerKm: toMin(6, 0) },
  // M3
  { seasonId: '2025/26', sexe: 'H', categorie: 'M3', vkMinMinPerKm: toMin(5, 20) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M3', vkMinMinPerKm: toMin(6, 10) },
  // M4
  { seasonId: '2025/26', sexe: 'H', categorie: 'M4', vkMinMinPerKm: toMin(5, 40) },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M4', vkMinMinPerKm: toMin(6, 20) },
  // M5 à M10 — pas de minima: champs absent -> null à la lecture
  { seasonId: '2025/26', sexe: 'H', categorie: 'M5' },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M5' },
  { seasonId: '2025/26', sexe: 'H', categorie: 'M6' },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M6' },
  { seasonId: '2025/26', sexe: 'H', categorie: 'M7' },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M7' },
  { seasonId: '2025/26', sexe: 'H', categorie: 'M8' },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M8' },
  { seasonId: '2025/26', sexe: 'H', categorie: 'M9' },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M9' },
  { seasonId: '2025/26', sexe: 'H', categorie: 'M10' },
  { seasonId: '2025/26', sexe: 'F', categorie: 'M10' }
];

const TABLE: MinimaEntry[] = [...MINIMAS_2025_26];

export function getMinimaVK(
  seasonId: string,
  sexe: Sexe,
  categorie: Categorie
): number | null {
  const rec = TABLE.find(
    (r) => r.seasonId === seasonId && r.sexe === sexe && r.categorie === categorie
  );
  if (!rec) return null;
  return rec.vkMinMinPerKm ?? null;
}

