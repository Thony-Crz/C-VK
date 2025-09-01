# C-VK
Application course à pied pour calculer des allures ou des objectifs
Voici un **petit cahier des charges** pour une application qui estime la vitesse/temps cible à tenir sur un trail afin d’être **qualifiable aux Championnats de France** — avec les règles officielles intégrées et des minimas configurables par catégorie (comme tu le souhaites).

# 1) Contexte & objectif

* **But** : permettre à un·e coureur·se d’indiquer un parcours (distance + dénivelé) et d’obtenir la **vitesse (VK)** et/ou **temps de course** nécessaires pour être qualifiable aux France de trail (format court ou long), selon sa **catégorie d’âge/sexo** et la **réglementation FFA** en vigueur.
* **Période & formats** : qualification sur **trails labellisés FFA** ≥ **30 km-effort** ; distinction **trail court (< 60 km-effort)** et **trail long (≥ 60 km-effort)** pour le format de qualification. ([Athlé][1])

# 2) Règles FFA à intégrer (sources officielles)

* **Fenêtre de qualification (saison 2025/2026)** : du **05/07/2025** au **10/03/2026** (pour les France 2026). ([Athlé][1])
* **Course support de la qualif** : il faut une **course labellisée FFA** et **≥ 30 km-effort** ; licence **Compétition** FFA obligatoire au moment de la perf. ([Athlé][1])
* **Format déterminé par le km-effort** :

  * Minima réalisés sur **< 60 km-effort ⇒ éligible trail court uniquement**
  * Minima réalisés sur **≥ 60 km-effort ⇒ éligible trail long uniquement**. ([Athlé][1])
* **Catégories & minimas VK (vitesse au km)** — saison 2025/2026 :

  * Espoirs/Seniors : **H 4’10/km, F 5’20/km**
  * M0 : **H 4’30, F 5’40**
  * M1 : **H 4’50, F 5’50**
  * M2 : **H 5’00, F 6’00**
  * M3 : **H 5’20, F 6’10**
  * M4 : **H 5’40, F 6’20**
  * **M5 à M10 : pas de minima, il suffit de terminer** un trail labellisé (court/long selon le format visé). (La FFA indique aussi un durcissement de −20" cette saison.) ([Athlé][1])
* **Définition VK-Trail (FFA)** : indicateur basé sur **distance & dénivelé** des **trails labellisés** ; le bilan prend en compte les épreuves **30–50 km-effort (trail court)** et **>50 km-effort (trail long)**. ([Athlé][2])
* **Kilomètre-effort** (référence FFA/ITRA) : **km-effort = distance (km) + D+ / 100** (100 m D+ = 1 km). ([Athlé][3], [Randonner Malin][4])
* **Trouver une course labellisée** : calendrier FFA « courses labellisées running » (utile pour pointer l’utilisateur vers des épreuves éligibles). ([Athlé][5])

> Remarque : ton app n’a pas besoin de recalculer l’indice VK-Trail « officiel » (qui est produit par la FFA à partir des résultats). Elle peut **estimer l’allure/temps cible** au **km-effort** cohérente avec les **minimas** ci-dessus, afin d’aider l’utilisateur à planifier.

# 3) Périmètre fonctionnel

## 3.1. MVP (indispensable)

1. **Saisie parcours** : distance (km) + D+ (m).
2. **Sélection catégorie** : Espoir, Senior, M0…M10 + sexe.
3. **Choix format visé** : court ou long (ou « auto » selon km-effort calculé).
4. **Calcul km-effort** : `km_effort = distance + D+/100`.
5. **Récupération des minimas** : via *table interne configurable* (voir 3.3).
6. **Estimation des objectifs** :

   * **Allure VK cible** = minima de la catégorie (si M5–M10, afficher « terminer la course »).
   * **Temps de course cible** (approx.) : `temps_cible ≈ allure_VK × km_effort`.
   * **Vitesse moyenne cible** (km/h) : `60 / allure_VK(min/km)`.
   * **Marges** : proposer ±1 à ±3 % pour tenir compte des conditions.
7. **Vérifications** :

   * Si **km-effort < 30** : avertir « non éligible qualification FFA ».
   * Si **format choisi ≠ format déterminé par km-effort** : avertir.
8. **Rapport clair** : statut « projet qualifiable ? », **temps/allure à tenir**, format (court/long), rappel de la règle FFA.
9. **Internationalisation FR d’abord** (unités métriques).

## 3.2. Fonctionnalités « ++ » (itérations suivantes)

* **Catalogue d’épreuves** : lien vers **calendrier FFA labellisé** avec filtres (date, région, km-effort). ([Athlé][5])
* **Profil d’athlète** : stocker historique, catégorie, performances passées, marge perso.
* **Simulation d’entraînement** : traduire l’objectif en séances (AS VK, rando-course, ascensions).
* **Export partage** : PDF/PNG du plan objectif.
* **Mode « réalité »** : ajuster avec météo, technicité (coefficient de difficulté local) → applique un facteur de prudence sur le temps estimé.

## 3.3. Administration / Configuration (ton besoin clé)

* **Table des minimas** **entièrement éditable** par toi :

  * Par **saison** (ex. 2025/26), **sexe**, **catégorie**, **format** → valeur **VK (min/km)**.
  * Historisation et versioning (pour conserver les saisons passées).
* **Paramètres généraux** :

  * Fenêtre de qualification (dates).
  * Seuils km-effort (par défaut : 30 min. pour être éligible, **60** pour la bascule court/long).
  * **Règle M5–M10** activable/désactivable (par défaut « terminer suffit »).
* **Import/Export** : CSV/JSON de la table minimas (pour MAJ rapide).

# 4) Modèle de données (proposition)

* `User` : id, nom, sexe, date\_naissance (⇒ catégorie), club (optionnel).
* `Season` : id, label, date\_debut, date\_fin, seuil\_court\_long (par défaut 60).
* `Minima` : id, season\_id, sexe, categorie (ES, SE, M0…M10), format (court|long|both), **vk\_min (min/km)**.
* `CourseEstimate` : id, user\_id, season\_id, distance\_km, dplus\_m, km\_effort, format\_calcule, categorie, vk\_cible, temps\_cible, marge\_plus\_moins\_pct, horodatage.
* `Settings` : flags (M5–M10 « terminer suffit »), seuil\_eligibilite (par défaut 30 km-effort), etc.

# 5) Algorithmes & formules

1. **km-effort** :
   `km_effort = distance_km + (dplus_m / 100)` (réf. FFA/ITRA). ([Athlé][3], [Randonner Malin][4])

2. **Détection format** :

* `format = "court"` si `km_effort < 60`
* `format = "long"` si `km_effort ≥ 60` (pour la qualif). ([Athlé][1])

3. **Allure cible (VK)** :

* Si **catégorie ∈ {ES, SE, M0…M4}** → prendre `vk_min` dans la table minimas (par sexe).
* Si **catégorie ∈ {M5…M10}** → **pas de vk\_min**, statut « finir la course labellisée » (selon format). ([Athlé][1])

4. **Temps cible (approx.)** :
   `temps_cible_min ≈ vk_min (min/km) × km_effort`

> Hypothèse : l’indice VK FFA normalise distance + D+ ; on convertit le **minima VK** en **temps approximatif** sur le **km-effort**. Cette estimation vise l’**objectif d’allure** compatible FFA, pas la reconstitution exacte de l’algorithme fédéral. ([Athlé][2])

5. **Validation éligibilité** :

* `km_effort >= 30` ? Oui ⇒ « parcours éligible » ; Non ⇒ message d’inéligibilité. ([Athlé][1])

# 6) UX / écrans

* **Écran Estimation**

  * Inputs : distance (km), D+ (m), sexe, date de naissance (→ catégorie auto), saison (défaut), format visé (auto/court/long).
  * Output : km-effort, format imposé, **allure VK cible**, **temps cible** (hh\:mm), **vitesse moyenne**, jauge de marge (±1–3%).
  * Alerte si km-effort < 30 ou si format visé ≠ format imposé.
  * Rappel **« course labellisée FFA »** + lien calendrier. ([Athlé][5])
* **Écran Admin « Minimas »**

  * Tableau par **saison**/**catégorie**/**sexe**/**format** → **VK (min/km)** éditable.
  * Boutons **Importer/Exporter** CSV/JSON ; **Dupliquer** la saison N en N+1 ; **Brouillon/Publier**.
* **Écran « Mon profil »** (option)

  * Catégorie calculée, saison courante, préférences (unités, marge par défaut).

# 7) Exemples concrets

* **Ex. A (long)** : 42 km / 2 000 m D+ → `km_effort = 42 + 2000/100 = 62` ⇒ **trail long**.

  * Catégorie **Senior H** (minima **4’10/km**) ⇒ temps cible ≈ `4.1667 × 62 ≈ 258 min` ≈ **4 h 18**. (Arrondir + marge 2–3%.) ([Athlé][1])
* **Ex. B (court)** : 28 km / 1 000 m D+ → `km_effort = 28 + 10 = 38` ⇒ **trail court**.

  * Catégorie **M2 F** (minima **6’00/km**) ⇒ temps cible ≈ `6 × 38 = 228 min` = **3 h 48**. ([Athlé][1])
* **Ex. C (M7)** : même parcours ; **M7 H/F** ⇒ **pas de minima** : il suffit **de terminer** une course labellisée sur le format visé. ([Athlé][1])

# 8) Tech & intégrations

* **Stack suggérée (web)** :

  * Front : React + TypeScript.
  * Back : Node (NestJS/Express) ou Python (FastAPI).
  * DB : Postgres (tables `Season`, `Minima`, `CourseEstimate`, `Users`, `Settings`).
* **Intégrations externes (facultatives)** :

  * **Lien FFA « courses labellisées »** (ou redirection vers la recherche FFA) pour que l’utilisateur choisisse une épreuve conforme. ([Athlé][5])
  * Import CSV de tes propres listes d’épreuves.
* **Validation de saisie** : distance > 0, D+ ≥ 0 ; bornes raisonnables.

# 9) Tests

* **Unitaires** : calcul km-effort, choix format, conversions min/km ↔ km/h, temps estimé.
* **Table de régression** : cas limite (km-effort = 29.9 / 30 / 60).
* **Snapshot** : cohérence d’affichage des minimas par saison.
* **End-to-end** : scénarios Ex. A/B/C ci-dessus.

# 10) Risques & limites (transparence)

* **VK-Trail officiel ≠ simple moyenne** : l’appli **estime** une allure cible cohérente avec les **minimas FFA**, mais ne reproduit pas l’algorithme exact de la FFA. (OK pour planifier, la validation réelle passe par une **perf sur course labellisée**.) ([Athlé][1], [Athlé][2])
* **Réglementation évolutive** (dates/minimas peuvent changer chaque saison) → d’où la **config minimas** par saison.

---

## Références clés (FFA)

* **Minimas & règles France Trail 2025/2026** (période, km-effort, court/long, catégories, M5–M10) : page « Championnats de France de trail » FFA. ([Athlé][1])
* **Définition VK-Trail (FFA)** : page « classements running ». ([Athlé][2])
* **Km-effort (principe FFA/ITRA)** : article FFA et rappel formule. ([Athlé][3], [Randonner Malin][4])
* **Calendrier / courses labellisées FFA** : pour choisir une épreuve éligible. ([Athlé][5])

[1]: https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=6271 "minima Trail | Fédération Française d'Athlétisme"
[2]: https://athle.fr/asp.net/main.html/html.aspx?htmlid=2149&utm_source=chatgpt.com "Les classements running | Fédération Française d'Athlétisme"
[3]: https://www.athle.fr/asp.net/main.news/news.aspx?newsid=16686&utm_source=chatgpt.com "Courses nature : une nouvelle règlementation pour clarifier les ..."
[4]: https://www.randonner-malin.com/kilometre-effort-en-randonnee/?utm_source=chatgpt.com "Kilomètre effort : comment le calculer pour vos randonnées ..."
[5]: https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=5256&utm_source=chatgpt.com "Tout le calendrier running 2025 | Fédération Française d'Athlétisme"
