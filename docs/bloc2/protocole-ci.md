# Protocole d’Intégration Continue (CI)

## Objectif
Automatiser les contrôles qualité à chaque push/PR : installation, lint, tests, build, artefacts.

## Pipelines
### Backend (NestJS) — `.github/workflows/ci-backend.yml`
- Déclencheurs : `push` et `pull_request` sur `main`/`develop`, chemins `getrady-backend/**`.
- Environnement : Node 20, `npm ci` (cache npm).
- Étapes : `lint` → `test --ci --passWithNoTests` → `build` → artefact `dist/`.
- Critères de réussite : toutes les étapes passent (code 0).  
- Secrets : non requis (pas d’accès aux clés en CI).

### Frontend (Expo) — `.github/workflows/ci-frontend.yml`
- Déclencheurs : `push` et `pull_request` sur `main`/`develop`, chemins `getrady-frontend/**`.
- Étapes : `npm ci` → `lint` (si présent) → `test:ci` (Jest, sans watch).
- Critères de réussite : toutes les étapes passent.

## Règles de branches
- `main` : stable / production.
- `develop` : intégration.
- `feature/*` : dev par fonctionnalité → PR vers `develop`.
- `hotfix/*` : correctifs urgents → PR vers `main`.

## Qualité attendue (évolutive)
- Lint sans erreur.
- Tests : backend et frontend (seuils de couverture à définir quand tests ajoutés).