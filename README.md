# GeTrady
Suivi d’actifs & signaux — Expo/React Native + NestJS.

## ⚙️ Pile technique
- Frontend : Expo / React Native (TypeScript)
- Backend  : NestJS + MySQL/MariaDB
- Tests    : Jest
- CI       : GitHub Actions

## 📦 Monorepo
.
├─ getrady-frontend/   # App mobile (Expo)
├─ getrady-backend/    # API (NestJS)
├─ docs/
├─ bloc2/
├─ bloc4/
└─ .github/workflows/  # CI

## 🚀 Démarrage rapide
> Guide détaillé : docs/bloc2/manuel-deploiement.md

1) Pré-requis
- Node 20+, npm
- MySQL/MariaDB
- Expo CLI (npx expo)

2) Base de données
Créer la BDD getrady en utf8mb4 :
CREATE DATABASE getrady
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

3) Variables d’environnement
- Backend : créer getrady-backend/.env (voir getrady-backend/.env.example)
- Frontend : getrady-frontend/.env
EXPO_PUBLIC_API_URL=http://localhost:3000

4) Installation & lancement
API :
$ cd getrady-backend
$ npm ci
$ npm run start

App :
$ cd ../getrady-frontend
$ npm ci
$ npx expo start
(ouvrir Expo Go et scanner le QR ; touche "S" pour l’afficher si besoin)

5) Vérifications
- API : GET http://localhost:3000/health → 200
- App : écran d’accueil + appels API OK

## 🧪 Tests
Backend :
$ cd getrady-backend
$ npm run test:ci

Frontend :
$ cd ../getrady-frontend
$ npm run test:ci

## 🔁 Intégration continue (CI)
- Tests backend & frontend sur chaque PR/push
- Workflows : .github/workflows/*
- Détails : docs/bloc2/protocole-ci.md

## 📚 Documentation
- Manuel de déploiement : docs/bloc2/manuel-deploiement.md
- Architecture        : docs/bloc2/architecture.md
- Sécurité            : docs/bloc2/securite.md
- Tests unitaires     : docs/bloc2/tests-unitaires.md
- Bloc 4 (MCO/Qualité): docs/bloc4/*
