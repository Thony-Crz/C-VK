## C‑VK — Estimation de qualification trail (FFA)

Application web (React + TypeScript) pour estimer la vitesse/allure et le temps cible à tenir sur un trail labellisé FFA afin d’être qualifiable aux Championnats de France, avec règles FFA intégrées et minimas configurables par catégorie.

Fonctionne côté navigateur (Vite) et expose une logique testée (Vitest) côté core.

## Fonctionnalités

- Saisie du parcours: distance (km) et D+ (m)
- Calcul du km‑effort: `distance_km + D+ / 100`
- Détection du format: `court` si `< 60` km‑effort, `long` si `≥ 60`
- Minimas VK par saison / sexe / catégorie (2025/26 intégrée, éditable en code)
- Estimation des objectifs:
  - VK cible (min/km) au format `mm:ss/km`
  - Temps cible (sur km‑effort): `VK × km‑effort`
  - Allure cible à plat (min/km): `temps_cible / distance_km`
  - Vitesse moyenne (km/h) et marges ±1/2/3% sur le temps
- Vérifications et avertissements:
  - Inéligible si `< 30` km‑effort
  - Alerte si format demandé ≠ imposé par le km‑effort
- Équivalence à plat affichée: `km‑effort` en km

Un PoC de scraper (Puppeteer) permet de produire un JSON de compétitions FFA (pour itérations futures).

## Prise en main rapide

Prérequis:
- Node.js ≥ 18.17 (recommandé: LTS récent)
- npm

Installation:
- `npm install`

Dev (hot‑reload):
- `npm run dev`
- Ouvrir l’URL affichée (ex: http://localhost:5173)

Tests (Vitest):
- `npm test`
- `npm run test:watch`

Build Web + Preview:
- `npm run build:web`
- `npm run preview`

## Utilisation

Dans l’écran principal:
- Renseigner Distance (km) et D+ (m)
- Choisir Sexe et Catégorie (ES, SE, M0…M10)
- Laisser Format visé sur « Auto » ou forcer court/long (une alerte apparaîtra si incohérent)

L’application affiche:
- Km‑effort, Format imposé
- Équivalence à plat (km)
- VK cible (min/km) au format `mm:ss/km`
- Allure cible à plat (min/km) au format `mm:ss/km`
- Temps cible (hh:mm) et marges ±1/2/3%
- Avertissements éventuels (inéligibilité, format demandé ≠ imposé)

Cas particulier M5–M10: pas de minima → objectif « terminer la course labellisée » sur le format visé.

## Règles & formules implémentées

- Km‑effort: `km_effort = distance_km + dplus_m / 100`
- Format imposé: `< 60` → court, `≥ 60` → long
- VK cible (min/km): depuis la table des minimas par saison/sexe/catégorie
- Temps cible (min): `temps = VK × km_effort`
- Allure cible à plat (min/km): `temps / distance_km`
- Vitesse moyenne (km/h): `60 / VK`
- Marges: ±1%, ±2%, ±3% appliquées sur le temps cible

Références FFA: pages « Championnats de France de trail », « Classements running », rappels sur le km‑effort.

## Architecture du code

- `src/core.ts` — primitives et utilitaires
  - `kmEffort(distanceKm, dPlusM)`
  - `detectFormat(kmEffortValue)` → `'court' | 'long'`
  - `minPerKmToPaceStr(minPerKm)` → `"mm:ss"`
- `src/minimas.ts` — table de minimas (2025/26) + types et lookup
  - `getMinimaVK(seasonId, sexe, categorie)` → `min/km | null`
- `src/estimator.ts` — estimation consolidée
  - Entrées: distance, D+, sexe, catégorie, saison, format visé (auto/court/long)
  - Sorties: km‑effort, format, VK cible, temps cible, vitesse moyenne, allures/vitesses « à plat », marges, warnings
- `src/ui/` — interface React (Vite)
  - `App.tsx`, `styles.css`

## Tests

Tests Vitest couvrant les formules et scénarios clés:
- `tests/kmEffort.test.ts` — formule km‑effort et validations
- `tests/format.test.ts` — détection court/long (59.99, 60)
- `tests/minimas.test.ts` — lookup minimas 2025/26
- `tests/estimator.test.ts` — cas d’usage (Ex. A/B/C), inéligibilité, mismatch format
- `tests/edges.test.ts` — régressions (29.9 / 30 / 60)
- `tests/pace.test.ts` — formatage d’allure `mm:ss`
- `tests/flatEquivalent.test.ts` — allure équivalente à plat = `temps / distance`

Lancer: `npm test`.

## Scraper (PoC)

Un script Puppeteer collecte une liste de compétitions depuis une URL de liste FFA et tente d’extraire quelques infos et mentions de distances/D+ (heuristiques):

```
npm run scrape:ffa -- --url "https://bases.athle.fr/asp.net/liste.aspx?..."
```

Sortie: `public/races.json`

Notes:
- Contenu des pages FFA sujet à changement (structure, chargement dynamique)
- Scripts limités (cap à 50 compétitions) et non robustes en production
- JSON non encore branché dans l’UI (prévu dans une itération suivante)

## Configuration des minimas

La table 2025/26 est codée dans `src/minimas.ts`. Vous pouvez adapter/étendre:
- Ajouter une nouvelle saison
- Modifier des valeurs VK (min/km) par sexe/catégorie
- Étendre les règles (ex: désactiver « M5–M10 → terminer suffit ») via paramètres à introduire

Itérations futures: import/export JSON/CSV, interface d’admin.

## Exemples rapides

- Ex. A (long): 42 km / 2000 m D+ → km‑effort = `62` → format long.
  - Senior H (VK 4:10/km) → temps cible ≈ `4.1667 × 62 ≈ 258` min (≈ 4 h 18)
  - Allure à plat ≈ `258 / 42 ≈ 6:09`/km

- Ex. B (court): 28 km / 1000 m D+ → km‑effort = `38` → format court.
  - M2 F (VK 6:00/km) → temps cible = `6 × 38 = 228` min (3 h 48)

- Ex. C (M7): pas de minima → objectif: terminer une course labellisée (format visé).

## Limites & Transparence

- L’algorithme FFA complet (VK‑Trail officiel) n’est pas reproduit. L’app fournit une estimation cohérente avec les minimas.
- La réglementation évolue (fenêtres, minimas): d’où la configuration par saison.
- Certaines chaînes historiques peuvent présenter des accents non normalisés; cela n’affecte pas le calcul (sera corrigé ultérieurement).

## Licence

Projet de démonstration — usage à adapter selon vos besoins internes. Aucune affiliation avec la FFA.

