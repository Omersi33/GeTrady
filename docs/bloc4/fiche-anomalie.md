# Anomalie traitée (exemple)

## Contexte
- Titre: [BUG] Latence anormale sur `/health`
- Version: 0.1.0
- Criticité: P2
- Issue: #123 / PR: #124

## Diagnostic
- p95 ~ 600 ms vs SLO 300 ms
- Cause racine: appel externe bloquant dans middleware

## Correctif
- Suppression/optimisation appel
- Tests: unit + recette (Cahier-de-recettes #4)

## Déploiement
- PR #124 → CI verte → merge `develop` → staging OK → merge `main`
- Rollback prêt (tag v0.1.0)

## Résultat
- p95 ~ 120–180 ms post-déploiement
- CHANGELOG: Fixed: latence `/health`