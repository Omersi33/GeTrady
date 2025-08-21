# Recommandations

## Qualité & Performance

### SLO (v1)
- **API** : p95 < **300 ms** sur endpoints publics
- **Disponibilité** : **99.5%**
- **Erreurs 5xx** : < **0.5%** req/j

### Budgets front (web)
- **TTI (simu mobile)** : < **5 s**
- **Bundle initial** : < **500 kB** gzip

### Mesure
- Logs latence & codes (backend)
- Web : Lighthouse (local), bundle-analyzer (option)
- CI : publier score/perf en commentaire de PR (option)

### Actions
- Cache/ETag si pertinent
- Pagination + requêtes **indexées** (DB)
- Images/Assets optimisés
- Monitoring **p95/p99** sur routes clés

---

## A4.3 — Axes d’amélioration / recommandations

Objectif : pistes **réalistes** pour améliorer performance, fiabilité et attractivité.  
KPIs : **p95 latence**, **taux 5xx**, **taux de crash**, **TTI app**, **couverture tests**, **temps de mise en prod**.

### 1) Performance back-end
- Index SQL sur colonnes filtrées/join, éviter N+1, **pagination** partout.
- **Cache** court (assets/signaux) côté API ; gzip + keep-alive.
> **Gain attendu** : −30/50% latence moyenne, P95 plus stable.

### 2) Fiabilité & observabilité
- TU services critiques + 1 **smoke E2E**.
- **/metrics** (latence, erreurs) + alertes seuils.
- Logs **structurés** (corrélation requête).
> **Gain** : détection rapide des régressions, MTTR ↓.

### 3) Sécurité (OWASP)
- **CORS strict**, JWT avec rotation/expiration, rate-limit (en place).
- Validation d’inputs, **Helmet** complet, HTTPS en prod.
> **Gain** : surface d’attaque réduite.

### 4) UX & accessibilité
- **Skeleton/loading** sur listes, messages d’erreur actionnables.
- A11y : labels, contrastes, tailles touch-targets.
> **Gain** : ressenti de vitesse ↑, inclusion.

### 5) Qualité de code & CI
- Lint/format homogènes, **pre-commit** (lint-staged).
- CI : job tests rapide, **auto-merge patch** Dependabot si CI verte.
> **Gain** : dette ↓, frictions ↓.

### 6) Exploitabilité & coûts
- Secrets via **env**, rotation planifiée.
- **Runbook** incident + manuel de déploiement à jour.
> **Gain** : mises en prod plus sûres.

### Plan de mise en œuvre (priorisé)

| Action | Effort | Impact | Resp. |
|---|:--:|:--:|---|
| Index SQL + pagination | S | ↑↑ | Back |
| Cache lecture (assets/signaux) | M | ↑↑ | Back |
| TU critiques + 1 smoke E2E | M | ↑ | Back/Front |
| CORS strict + Helmet checklist | S | ↑ | Back |
| Skeleton + erreurs actionnables | S | ↑ | Front |
| CI auto-merge patch deps (tests OK) | S | ↑ | DevOps |
| Métriques + alerte erreurs | M | ↑ | DevOps |

**Échéancier** : Quick wins S1 (index, CORS, skeleton, auto-merge) → S2 (cache, métriques, tests).

### Mesure & validation
- Dashboard : p95, 5xx, TTI, couverture tests.
- Comparer **avant/après** chaque lot ; valider si objectif atteint (ex. p95 −30%).
