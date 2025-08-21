# Qualité & Performance

## SLO (v1)
- API: p95 < **300 ms** sur endpoints publics
- Disponibilité: **99.5%**
- Erreurs 5xx: < **0.5%** req/j

## Budgets front (web)
- TTI (simu mobile): < **5s**
- Bundle app (initial): < **500 kB** gzip

## Mesure
- Logs latence et codes (backend)
- Web: Lighthouse (local), bundle-analyzer (option)
- Rapports CI: publier score/perf en commentaire PR (option)

## Actions
- Cache/ETags si pertinent
- Pagination/requêtes indexées (DB)
- Images/Assets optimisés
- Monitoring p95/p99 sur routes clés