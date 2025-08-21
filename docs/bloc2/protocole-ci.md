# Protocole d’Intégration Continue (CI)

## Objectif
Assurer automatiquement la **qualité minimale** à chaque **push/PR** :
- installation déterministe (`npm ci`)
- exécution des **tests** backend & frontend en mode CI
- isolation par dossier (monorepo) + **cache npm** + **concurrency** (évite les jobs doublons)

---

## Déclencheurs & périmètre
- **Branches** : `main`, `develop`
- **Déclencheurs** : `pull_request` (par défaut) + `workflow_dispatch` (lancement manuel)
- **Ciblage par chemins** :
  - backend : `getrady-backend/**`
  - frontend : `getrady-frontend/**`
- **Concurrency** : un seul run actif par ref (`cancel-in-progress: true`)

---

## Jobs actuels

### Backend (NestJS) — `.github/workflows/ci-backend.yml`
- **Environnement** : Node 20, cache npm (clé basée sur `getrady-backend/package-lock.json`)
- **Working dir** : `getrady-backend/`
- **Étapes exécutées** :
  - `npm ci --no-audit --prefer-offline`
  - `npm test -- --ci --passWithNoTests`
- **Lint** : **désactivé** pour le moment (problème de config linters ; voir « Limites temporaires »)
- **Build** : non requis actuellement (pas d’artefacts produits)
- **Réussite** : tests **verts** (code 0)

### Frontend (Expo/React Native) — `.github/workflows/ci-frontend.yml`
- **Environnement** : Node 20, cache npm (clé basée sur `getrady-frontend/package-lock.json`)
- **Working dir** : `getrady-frontend/`
- **Étapes exécutées** :
  - `npm ci --no-audit --prefer-offline`
  - `npm run test:ci` (Jest, sans watch)
- **Lint** : **non exécuté en CI** (voir « Limites temporaires »)
- **Build** : non requis
- **Réussite** : tests **verts** (code 0)

---

## Règles de branches
- `main` : stable / production
- `develop` : intégration
- `feature/*` : dev par fonctionnalité → PR vers `develop`
- `hotfix/*` : correctifs urgents → PR vers `main`

---

## Ce qui est vérifié aujourd’hui
- **Backend** : suites Jest (ex. `market.*.spec.ts`, e2e minimal) → **OK**
- **Frontend** : suites Jest (ex. `AssetCard`, `ConfigModal`, `login`) → **OK**
- **Gating PR** : une PR ne doit pas être mergée si un job CI est rouge

---

## Limites temporaires (assumées)
- **Lint backend** : désactivé localement et **non lancé** en CI (conflits de config ESLint/Prettier).  
  ➜ sera réactivé ultérieurement avec une config unifiée.
- **Lint frontend** : non lancé en CI (ESLint v9 vs ancienne conf).  
  ➜ réactivation possible plus tard (migrer vers `eslint.config.js` ou conserver `.eslintrc` v8).

> Conséquence : la CI valide **les tests**, mais **pas** le lint. C’est un choix volontaire à ce stade.

---

## Relancer / diagnostiquer
- **Relancer un run** : onglet **Actions** → sélectionner le workflow → **Re-run all jobs**.
- **Voir les logs** : ouvrir le job → **Steps** → consulter les `Run npm …`.
- **Tester en local** :
  - backend : `cd getrady-backend && npm ci && npm run test:ci`
  - frontend : `cd getrady-frontend && npm ci && npm run test:ci`

---

## Évolutions prévues (optionnel)
- Réactiver le **lint** (backend & frontend) une fois la config stabilisée.
- Ajouter **seuils de couverture** (ex. `--coverage` avec gate).
- Publier des **artefacts** si besoin (builds, coverage reports).
- Marquer les checks CI comme **required** dans les protections de branche GitHub.

---

## Bonnes pratiques
- Toujours ouvrir une **PR vers `develop`** (sauf hotfix).
- Attendre le **vert** des jobs CI avant merge.
- En cas de dépendances (Dependabot), laisser la CI valider les tests avant d’accepter.