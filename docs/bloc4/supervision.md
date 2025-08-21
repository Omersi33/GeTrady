# Monitoring & Alerting

## Périmètre
- Backend: latence p95, taux 5xx, uptime `/health`
- Front web (si activé): disponibilité hébergeur, erreurs JS

## Sondes/indicateurs
- Ping `/health` chaque minute
- Export métriques latence & codes (logs + agrégation)
- Compteur erreurs “login” serveur

## Seuils & alertes
- p95 > 300 ms 5 min → alerte canal #ops
- 5xx > 1% 5 min → alerte
- Uptime < 99.5% sur 30 jours → alerte mensuelle

## Runbook (ex.)
- Alerte latence: vérifier charge, DB, derniers déploiements → rollback si régression