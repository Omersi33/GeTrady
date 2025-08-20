# Stratégie de tests unitaires

## Backend (NestJS)

### Périmètre v1 réalisé
- `market.service.spec.ts`
  - calcule TP/SL en **BUY**
  - fallback sur dernière **close** si live invalide en **SELL**
  - mapping `getAssetSignal` + erreur si symbole inconnu
  - mapping `listAllAssets`
- `market.controller.spec.ts`
  - lève une **400** si `symbol` manquant
  - relai vers `advise` / `getAssetSignal` / `listAllAssets`
- `test/app.e2e-spec.ts`
  - vérifie `GET /health` (ou `/api/health`) ⇒ **200** + `{ status, db }`

### Commandes
- **Dev** : `npm test`
- **Couverture** : `npm run test:cov`
- **End-to-end** : `npm run test:e2e`
- **CI** : `jest --ci --passWithNoTests` (les TU tournent à chaque push/PR)

### Config Jest utilisée (résumé)
- `jest.config.js` : `ts-jest` + `moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' }`
- `tsconfig.spec.json` : `types: ["jest","node"]`, `isolatedModules: true`
- `test/jest-setup.ts` : `import 'reflect-metadata'`

### Preuves (exécution locale)
- `npm test` → **3 suites vertes**, **10 tests passés**
- `npm run test:e2e` → **health OK** (200 + payload)

---

## Frontend (Expo/React Native)
- Cible v1 :
  - 2 tests de composants (ex. `AssetCard`, `AuthCard`)
- Commandes :
  - `npm run test` (watch)
  - CI : `npm run test:ci`