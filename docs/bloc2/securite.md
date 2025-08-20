# Sécurité applicative — backend

## Protections globales
- **Helmet** : en-têtes HTTP sécurisés.
- **CORS** : origines autorisées via `CORS_ORIGINS` (dev: autorise tout si vide).
- **ValidationPipe (class-validator/transformer)** : `whitelist`, `forbidNonWhitelisted`, `transform`.
- **Rate limit (Throttler)** : 100 req/min/IP.
- **Secrets & env** : variables dans `.env` (non commit), exemple public `.env.example`. Rotation recommandée (DB/JWT).

## Endpoints techniques
- `/health` : ping + check DB (`SELECT 1`).
- `/metrics` : exposition Prometheus (perf & erreurs).

## (Si en place) Validation du `.env` via Joi
- Schéma : ports, JWT_SECRET ≥ 32 chars, clés externes requises.

## Preuves & vérifs
- `curl /health` → `db: true`.
- Bombardement `/health` + contrôle `http_requests_total` et `…duration_seconds_*`.
- 404 visible dans `http_requests_total{status="404"}`.
- (Optionnel) 500 contrôlé en debug.

## Références OWASP (couvertes partiellement)
- A01-Broken Access Control : à compléter (RBAC/guards).
- A02-Cryptographic Failures : gestion secrets/env, JWT.
- A05-Security Misconfiguration : Helmet, CORS, validation, rate-limit.
- A07-Identification & Authentication : (à compléter côté Auth).
- A09-Security Logging & Monitoring : `/metrics`, (à compléter avec Sentry).