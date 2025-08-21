# Scénarios & Résultats

## Contexte
- Version: v0.1.0
- Envs: dev/staging
- Prérequis: back up, front up, compte test

## Scénarios
1. **Login OK**
   - Étapes: saisir email/pwd valides → Se connecter
   - Attendu: redirection `/`, token en mémoire
   - Résultat: __OK/KO__ (preuve: capture)
2. **Login KO (pwd)**
   - Attendu: message “Mot de passe incorrect”
   - Résultat: __OK/KO__
3. **Liste d’actifs (admin)**
   - Attendu: affichage, édition config, suppression ok (confirm)
   - Résultat: __OK/KO__
4. **/health**
   - Attendu: 200 + `{ status, db }`
   - Résultat: __OK/KO__

## Synthèse
- Nombre OK/KO, anomalies ouvertes (liens issues)