# Déploiement (CD)

## Cible & branches
- `develop` → env. **staging**
- `main`    → env. **production**
- Stratégie merge: PR + CI verte (tests) → **deploy**

## Backend (NestJS)
- Build: `cd getrady-backend && npm ci && npm run build`
- Artefact: `dist/`
- Run (ex.): `node dist/main.js` ou Docker (image app:latest)
- Variables: `.env` (jamais commité)
- Healthcheck: `GET /health` (attendu: `{ status, db }`)

## Frontend (Expo)
- Web (option rapide): `cd getrady-frontend && npm ci && npx expo export -p web`
- Mobile (option prod): **EAS Build** (Android/iOS) — liens artefacts

## Rollback
- Git: revert merge PR (tag/commit `vX.Y.Z`)
- Infra: garder N-1 (dernière image / build) → redeploy

## Preprod → Prod (checklist)
- CI verte (back + front)
- CHANGELOG à jour
- Migration DB (si besoin) appliquée
- Smoke tests: `/health`, écran d’accueil, auth OK