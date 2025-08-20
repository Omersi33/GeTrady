# Cahier de recettes — socle technique

## Recettes API techniques
- R1 — Santé :
  - **Étapes** : `GET /health`
  - **Attendu** : 200, `{status:"ok", db:true}`
  - **Résultat** : ✅ / ❌

- R2 — Métriques :
  - **Étapes** : ouvrir `/metrics`
  - **Attendu** : `Content-Type: text/plain; version=0.0.4`, présence de `http_requests_total`, `http_request_duration_seconds_*`
  - **Résultat** : ✅ / ❌

- R3 — Limitation de débit :
  - **Étapes** : générer >100 req/min/IP
  - **Attendu** : `429 Too Many Requests` après le seuil
  - **Résultat** : ✅ / ❌

- R4 — CORS (Expo Web) :
  - **Pré-requis** : `CORS_ORIGINS` défini
  - **Étapes** : appel front web depuis `http://localhost:19006`
  - **Attendu** : requêtes acceptées
  - **Résultat** : ✅ / ❌

## À venir (fonctionnel)
- Auth (login/refresh) — scénarios succès/échec.
- Alertes BUY/SELL — création, envoi, réception (mobile).
- Droits d’accès — endpoints protégés & rôles.