# Processus de collecte & traitement des anomalies

## Signalement (consignation)
- **Outil** : GitHub Issues avec le template **“Anomalie / Bug”**  
  `/.github/ISSUE_TEMPLATE/bug_report.yml`
- **Accès** : créer une “New issue” → choisir “Anomalie / Bug”.
- **Champs obligatoires (dans le formulaire)** : Contexte, Étapes de reproduction, Résultat attendu, Résultat observé, **Criticité** (Bloquant/Majeur/Mineur).  
  Champs complémentaires : Version/commit, Environnement, Logs/Captures, Notes.
- **Support non-bug** : questions générales → Discussions GitHub (voir lien dans `/.github/ISSUE_TEMPLATE/config.yml`).

## Tri & priorisation (SLA)
- **P1 Bloquant** : crash, perte de données, auth/paiement impossible → **corrigé < 24h**.
- **P2 Majeur** : fonctionnalité clé dégradée → **corrigé < 3 j ouvrés**.
- **P3 Mineur** : UI/texte/edge-case → **planifié** dans le prochain sprint.

## Cycle de vie (workflow)
`Ouverte → Qualifiée (reproductible ?) → Affectée → En cours → PR → Test recette → Fermée → Journalisée (CHANGELOG)`
- À l’ouverture : étiquette `bug` + `P1|P2|P3`, assignation d’un responsable.
- À la fermeture : référencer l’issue dans la PR et **renseigner le CHANGELOG** (section “Fixed/Changed”).

## Bonnes pratiques de consignation
- **Étapes précises** : numérotées, reproductibles.
- **Preuves** : logs (stack trace), captures/vidéos, extrait de `/metrics` si pertinent.
- **Contexte** : appareil/OS, réseau, version app/commit.
- **Confidentialité** : anonymiser toute donnée sensible (tokens, e-mails, etc.).

## Preuves
- Lien vers une issue d’exemple (à ajouter).
- Capture `/metrics` montrant un pic d’erreurs si applicable.