# Fiche d’anomalie — Exemple

## Métadonnées
- **ID interne** : BUG-2025-08-19-001
- **Titre** : [BUG] Latence anormale sur `/health`
- **Service** : getrady-backend (NestJS)
- **Version / Commit** : 0.1.0 (abc123)
- **Environnement** : VPS Windows (prod)
- **Criticité** : P2 — Majeur
- **Signalement** : 2025-08-19 14:20 (Europe/Paris)
- **Responsable** : @maintainer

## Contexte
Constat d’une hausse de la latence p95 sur l’endpoint `GET /health`.
Impact utilisateur : supervision trompeuse (risque d’alertes tardives) ; aucune perte de données.

## Étapes pour reproduire
1. Lancer un trafic continu : `npx autocannon -d 10 -c 10 http://<host>:3000/health`
2. Consulter `GET /metrics` puis vérifier les histogrammes `http_request_duration_seconds_*`.
3. Observer la latence p95 > 500 ms sur la fenêtre de 1 min.

## Résultat attendu
- p95 `/health` < **300 ms** (SLO supervision).

## Résultat observé
- p95 `/health` ≈ **600 ms** pendant ~10 min.

## Preuves (logs / métriques / captures)
- Métriques Prometheus (exemples de requêtes) :
    histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{route="/health"}[5m])) by (le))
- Compteur erreurs (pour contrôle) :
    sum(rate(http_requests_total{status=~"5.."}[5m]))
- Captures : voir dossier `docs/bloc4/preuves/BUG-2025-08-19-001/` (latence p95 & throughput).

## Analyse (cause racine)
- **Symptômes** : pics de latence corrélés au moment de rotation des logs.
- **5-Whys (résumé)** :
  - Pourquoi latence ? → Event loop bloqué par IO sync ponctuel.
  - Pourquoi IO sync ? → Logger par défaut sans rotation asynchrone.
  - Pourquoi pas de buffer ? → Config prod non optimisée.
- **Cause probable** : écriture de logs non bufferisée lors des rafales `/health`.

## Portée & risques
- Portée : endpoint `/health` (supervision) uniquement.
- Risques : bruit d’alerting, faux positifs (SLA non impacté côté métier).

## Correctif appliqué
- Changement logger → écriture asynchrone + réduction du niveau sur `/health`.
- Ajout d’un cache 1s sur la réponse `/health` (anti-burst).
- Vérification : latence p95 revenue < 200 ms.

## Vérification & recette
- Recette technique :
  - `GET /health` sous charge (10 req/s) → p95 < 300 ms
  - Aucune 5xx observée ✅
- Recette monitoring :
  - Tableaux de bord mis à jour (p95, p99, throughput)
  - Alerte “latence p95 > 300 ms (5 min)” en **Warning**, > 600 ms en **Critical**

## Actions préventives
- Ajouter alerte **p95** + **5xx/min** (Prometheus/Grafana).
- Documenter “bonnes pratiques logs” (IO async + niveaux).
- Étendre tests e2e de santé avec mesure de latence sur banc local (optionnel).

## Références
- Issue : #XYZ
- PR : #ABC
- Commits : `abc123`, `def456`
- CHANGELOG : section **Fixed** de la version 0.1.1

## Timeline
- 14:20 — Détection
- 14:25 — Qualification
- 15:00 — Correctif prêt (PR #ABC)
- 15:20 — Déploiement prod
- 15:30 — Latence p95 revenue < 200 ms (confirmée sur 30 min)