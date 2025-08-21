# Sécurité applicative

## Protections backend (actuelles)
- **Helmet** : en-têtes HTTP sécurisés.
- **CORS** : origines autorisées via `CORS_ORIGINS` (dev : autorise tout si vide).
- **Validation** (class-validator/transformer) : `whitelist`, `forbidNonWhitelisted`, `transform`.
- **Rate limit** (Throttler) : 100 req/min/IP.
- **Secrets & env** : variables dans `.env` (non commit), rotation recommandée (DB/JWT).
- **Endpoints techniques**
  - `/health` : ping + check DB (`SELECT 1`).
  - `/metrics` : exposition Prometheus (perf & erreurs).

## OWASP Top 10 — Couverture v1
- **A01 – Broken Access Control** : guards + rôles (admin vs user) sur routes sensibles (à renforcer).
- **A02 – Cryptographic Failures** : JWT, secrets en env, pas de secrets en Git.
- **A03 – Injection** : DTO + requêtes paramétrées côté repo/service.
- **A05 – Security Misconfiguration** : Helmet, CORS restrictif, validation stricte, rate-limit.
- **A07 – Identification & Authentication** : JWT + règles de mot de passe, changement de mot de passe, invalidation à la déconnexion.
- **A09 – Security Logging & Monitoring** : `/metrics`, logs d’accès/erreurs (renforcer avec Sentry/ELK si dispo).

## Protections frontend (compléments)
- **Validation côté client** (zod) + messages d’erreur explicites (pas d’info-leak).
- **Stockage minimal** du token (mémoire / storage sécurisé), pas de secrets dans le bundle.
- **CORS/HTTPS** : appel API uniquement sur origines de confiance en production.
- **A11y & UX** : erreurs lisibles (évite contournements par confusion utilisateur).

## Recommandations opérationnelles
- **Gestion secrets** : `.env` par environnement, jamais en Git, rotation périodique.
- **CI** : exécuter les tests et bloquer le merge si échec (lint sécurité désactivé pour l’instant).
- **Durcissement prod** :
  - logs d’audit (401/403, tentatives échec),
  - surveillance p95 + taux 5xx,
  - alertes sur seuils (voir `docs/bloc4/supervision.md`).
- **Plan de réponse** : modèle d’incident dans `docs/bloc4/fiche-anomalie.md` (cause racine, correctif, rollback).

## Vérifications rapides
- `GET /health` → `200` avec `{ status, db }`.
- Pic de requêtes `/health` : pas de 5xx, p95 stable.
- CORS bloqué sur origine inconnue (prod).
- Routes admin inaccessibles à un user standard.