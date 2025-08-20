# Supervision & points de vie

## Endpoints
- `GET /health` : statut général + DB (`{status, db, uptime, timestamp}`).
- `GET /metrics` : métriques Prometheus (texte), labels : `method, route, status`, + métriques Node (CPU, mémoire, eventloop, GC).

## Procédure de vérif rapide
1) Santé : `curl http://<host>:3000/health` ⇒ `status: ok`, `db: true`.
2) Charge : bombarder `/health`, puis vérifier `/metrics` :
   - `http_requests_total{route="/health",status="200"}`
   - `http_request_duration_seconds_*` (buckets, sum, count).
3) Erreurs : appeler une route inexistante ⇒ `404` visible dans `http_requests_total{status="404"}`.

## Intervalles de scrutation (reco)
- Scape Prometheus : `5s` (critique) à `15s` (classique).
- Tableaux de bord : latence p95, erreurs 5xx/min, CPU/mémoire process.

## Seuils d’alerte (à préciser)
- Erreurs 5xx ≥ 1/min pendant 5 min.
- Latence p95 `/health` > 300 ms pendant 5 min.
- `db: false` sur `/health` immédiat (alerte critique).