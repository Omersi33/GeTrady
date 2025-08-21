# Upgrade

## Mise à jour applicative
1. Pull dernière version `develop` / `main`
2. `npm ci` (back & front)
3. Migrations DB si besoin
4. Redémarrage services

## Dépendances
- Outil auto: **désactivé** (process doc OK)
- MAJ manuelle: ouvrir PR “chore(deps)”, CI verte, merge