## [Unreleased]
### Added
- Structure initiale des dossiers Bloc 2 & Bloc 4.
- Endpoint `GET /health` (statut + check DB).
- Endpoint `GET /metrics` (Prometheus) + compteurs/histogrammes HTTP.
- Pipeline CI backend `.github/workflows/ci-backend.yml` (lint, tests, build, artefact `dist/`).
- Pipeline CI frontend `.github/workflows/ci-frontend.yml` (lint + tests Jest en CI).
- Fichiers de doc Bloc 2 & 4 (sécurité, supervision, recettes, protocole CI).
- Configuration Dependabot pour backend, frontend et GitHub Actions.

### Changed
- Sécurisation backend : Helmet, ValidationPipe (whitelist/forbid/transform), CORS via `CORS_ORIGINS`, rate-limit global (100 req/min/IP).
- Gestion des variables : `.env` non versionné + ajout de `.env.example` (sans secrets).
- (Si activé) Validation des variables d’environnement via Joi (`ConfigModule.forRoot({ validationSchema: … })`).