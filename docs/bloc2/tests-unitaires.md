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

### Config Jest (résumé)
- `jest.config.js` : `ts-jest` + `moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' }`
- `tsconfig.spec.json` : `types: ["jest","node"]`, `isolatedModules: true`
- `test/jest-setup.ts` : `import 'reflect-metadata'`

---

## Frontend (Expo / React Native)

### Suites en place (toutes vertes)
- `app/(auth)/__tests__/login.test.tsx`
  - saisie email + password
  - hash `sha1` puis `useAuth().login({ email, password })`
  - redirection `router.replace('/')` si succès
- `components/__tests__/AssetCard.test.tsx`
  - toggle expansion (chevron down ⇄ up)
  - icônes admin visibles (edit / trash) si `user.isAdmin`
  - suppression via `Alert.alert` ⇒ `AssetService.delete(id)` + callback `onDeleted(id)`
- `components/__tests__/ConfigModal.test.tsx`
  - pré-remplissage depuis `initial`
  - soumission numérisée (`onSubmit` reçoit bien des **nombres**)

### Patterns & conventions
- **Rendu** : `react-test-renderer` + **`act(...)` obligatoire** autour des créations, updates et handlers.
- **Sélections** :
  - `findAll((n) => (n.type as any) === 'InputRowMock')` (évite le conflit *ElementType*).
  - `findByProps({ label: 'Valider' })`, `findAllByProps({ name: 'trash-2' })`.
- **Mocks “hoist-safe”** (prévient *module factory out-of-scope*):
  - Dans `jest.mock(...)`, ne pas referencer de variable locale.
  - Publier les espions via exports : `__loginMock`, `__replaceMock`, `__deleteMock`, etc.

### Scripts
- `npm test` → local
- `npm run test:ci` → `jest --ci --passWithNoTests`