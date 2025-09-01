import { kmEffort, detectFormat, Format } from './core';
import { getMinimaVK, Sexe, Categorie } from './minimas';

export interface EstimateInput {
  distanceKm: number;
  dPlusM: number;
  sexe: Sexe;
  categorie: Categorie;
  seasonId: string;
  requestedFormat?: Format | 'auto';
}

export interface EstimateResult {
  kmEffort: number;
  // Distance équivalente si c'était à plat (km)
  flatEquivalentKm: number;
  formatCalcule: Format;
  eligibleParcours: boolean;
  vkCibleMinPerKm: number | null;
  tempsCibleMinutes: number | null;
  vitesseMoyKmH: number | null;
  // Allure équivalente à plat (mm/km) = temps_cible / distance_km
  allureAPlatMinPerKm: number | null;
  // Vitesse équivalente à plat (km/h)
  vitesseAPlatKmH: number | null;
  requiresFinishOnly: boolean;
  // Marges proposées ±1%, ±2%, ±3% (sur le temps)
  margesPct: number[];
  tempsAvecMargeMinutes: Array<{ pct: number; min: number | null; max: number | null }>;
  warnings: string[];
}

const ELIG_MIN_KM_EFFORT = 30;

export function estimateCourse(input: EstimateInput): EstimateResult {
  const warnings: string[] = [];
  const kmEff = kmEffort(input.distanceKm, input.dPlusM);
  const format = detectFormat(kmEff);

  const eligibleParcours = kmEff >= ELIG_MIN_KM_EFFORT;
  if (!eligibleParcours) {
    warnings.push('Parcours non éligible qualification FFA (< 30 km-effort).');
  }

  if (input.requestedFormat && input.requestedFormat !== 'auto' && input.requestedFormat !== format) {
    warnings.push(
      `Attention: format demandé (${input.requestedFormat}) ≠ format imposé par km-effort (${format}).`
    );
  }

  const vk = getMinimaVK(input.seasonId, input.sexe, input.categorie);
  const requiresFinishOnly = vk == null;

  const temps = vk != null ? vk * kmEff : null;
  const vitesse = vk != null ? 60 / vk : null;

  const allureAPlatMinPerKm = vk != null && input.distanceKm > 0 ? (temps! / input.distanceKm) : null;
  const vitesseAPlatKmH = allureAPlatMinPerKm != null ? 60 / allureAPlatMinPerKm : null;

  const margesPct = [0.01, 0.02, 0.03];
  const tempsAvecMargeMinutes = margesPct.map((pct) => ({
    pct,
    min: temps != null ? temps * (1 - pct) : null,
    max: temps != null ? temps * (1 + pct) : null
  }));

  return {
    kmEffort: kmEff,
    flatEquivalentKm: kmEff,
    formatCalcule: format,
    eligibleParcours,
    vkCibleMinPerKm: vk ?? null,
    tempsCibleMinutes: temps,
    vitesseMoyKmH: vitesse,
    allureAPlatMinPerKm,
    vitesseAPlatKmH,
    requiresFinishOnly,
    margesPct,
    tempsAvecMargeMinutes,
    warnings
  };
}
