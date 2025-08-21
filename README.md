# GeTrady
Suivi d’actifs & signaux — Expo/React Native + NestJS.

## Pile technique
- Frontend : Expo / React Native (TypeScript)
- Backend  : NestJS + MySQL/MariaDB
- Tests    : Jest
- CI       : GitHub Actions

## Monorepo
.
├─ getrady-frontend/    # App mobile (Expo)
├─ getrady-backend/     # API (NestJS)
├─ docs/
├─ bloc2/
├─ bloc4/
└─ .github/workflows/   # CI

## Démarrage rapide
Voir docs/bloc2/manuel-deploiement.md

## Environnements
- Backend : getrady-backend/.env.example
- Frontend : voir manuel de déploiement (docs/bloc2/manuel-deploiement.md)

## Tests
- Guide : docs/bloc2/tests-unitaires.md
- Scripts : voir package.json de chaque module

## Intégration continue
- Workflows : .github/workflows/
- Détails : docs/bloc2/protocole-ci.md

## Documentation
- Déploiement : docs/bloc2/manuel-deploiement.md
