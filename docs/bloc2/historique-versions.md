# Historique des versions & stratégie

## Versionnage
- **SemVer** : `MAJOR.MINOR.PATCH`
  - `feat:` → MINOR
  - `fix:` → PATCH
  - `!` (breaking change) → MAJOR

## Convention de commits
- Conventional Commits : `type(scope)?: message`
  - Ex. `feat(market): add buy/sell alert rule`
  - Ex. `fix(auth): handle expired token`

## Processus de release
1) Mettre à jour `CHANGELOG.md` (section **Unreleased** → nouvelle version).
2) Tag `vX.Y.Z` sur `main`.
3) Créer la Release GitHub (notes = extrait du CHANGELOG).