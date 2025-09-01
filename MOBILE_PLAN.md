# Plan de portage mobile — C‑VK

Ce document décrit les options et le plan d’action pour transformer l’application web actuelle en application mobile publiable sur les stores (iOS App Store / Google Play).

## Options techniques

- Expo (React Native) — recommandé
  - Portage rapide depuis React/TypeScript
  - Déploiement fluide (EAS Build) sur iOS/Android
  - Accès natif et écosystème mature

- Capacitor (emballage de l’app web)
  - Mise en paquet de la web app dans une WebView
  - Très rapide si l’UI web convient telle quelle
  - UX moins “native”, dépend de plugins pour APIs natives

- PWA standalone
  - Installation “Add to Home Screen”
  - Pas de présence en store natif

## Recommandation

Prendre Expo (React Native) pour une app native, en réutilisant la logique core existante (déjà isolée) et en reconstruisant l’UI.

## Étapes — Expo (React Native)

1) Préparer le partage du core
- Extraire ou partager `src/core.ts`, `src/minimas.ts`, `src/estimator.ts`
- Option A: créer un monorepo (npm/pnpm workspaces) et déplacer le core dans `packages/core`
- Option B: publier le core en package privé (npm) et l’installer dans l’app mobile

2) Créer le projet Expo
- `npx create-expo-app c-vk-mobile --template`
- TypeScript activé (template TS)
- Ajouter ESLint/Prettier si souhaité

3) Brancher le core
- Importer les fonctions du core (workspace ou package)
- Vérifier compatibilité TSConfig (paths/types)

4) UI mobile (React Native)
- Écran unique d’estimation avec:
  - Inputs: distance (km), D+ (m), sexe, catégorie, saison, format visé
  - Affichages: km‑effort, format imposé, VK cible (mm:ss/km), allure à plat (mm:ss/km), temps cible (hh:mm), marges ±1/2/3%, avertissements
- Composants RN: `TextInput`, `Picker`/`Select` (ex: `@react-native-picker/picker`), `Pressable`, `View`, `Text`
- Styles: `StyleSheet` (ou lib UI: Tamagui/NativeWind)

5) Tests
- Conserver Vitest/Jest pour le core (déjà en place)
- (Option) Ajouter tests e2e plus tard (Detox, Expo E2E)

6) Assets & config
- Icône (1024x1024), Splash, nom de l’app, bundleId (iOS), applicationId (Android)
- Fichier `app.json`/`app.config.ts` (Expo)

7) Builds et Stores (EAS)
- Créer comptes développeurs (Apple / Google Play)
- `npx expo install expo-updates` (si OTA souhaitées)
- `npx expo prebuild` (si nécessaire) ou utiliser EAS Build
- `eas build -p android` (AAB) / `eas build -p ios` (IPA)
- Soumissions: `eas submit` ou via consoles stores

## Étapes — Capacitor (alternative rapide)

1) Ajouter Capacitor
- `npm i -D @capacitor/cli @capacitor/core`
- `npx cap init`

2) Plateformes
- `npx cap add android`
- `npx cap add ios`

3) Build & Copy
- `npm run build:web`
- `npx cap copy`
- Ouvrir Android Studio/Xcode pour générer AAB/IPA

## Estimation d’effort (indicatif)

- Expo: 1 à 2 jours (scaffold, portage UI, build EAS, assets)
- Capacitor: ~0.5 jour (packaging + tests sur devices)

## Points d’attention

- UX mobile: clavier numérique, validations, accessibilité (TalkBack/VoiceOver)
- Performance: éviter calculs lourds côté UI (le core est léger ici)
- Internationalisation FR OK; prévoir i18n si multi‑langues
- Politique store: pas de permissions sensibles; fournir mentions légales si nécessaire

## Checklist de livraison

- [ ] App Expo créée et compile sur iOS/Android (local device/simulator)
- [ ] UI mobile complète et alignée avec le web
- [ ] Tests core verts (Vitest/Jest)
- [ ] Icône, splash, nom, bundle IDs
- [ ] Builds EAS: Android AAB, iOS IPA
- [ ] Captures d’écran et métadonnées Store

