# Mise à jour des dépendances

## Politique
- **Outil** : Dependabot (activé via `/.github/dependabot.yml`).
- **Périmètre** :
  - npm — **backend** (`/getrady-backend`)
  - npm — **frontend** (`/getrady-frontend`)
  - **GitHub Actions** — workflows CI
- **Fréquence** : hebdomadaire — **lundi 09:00 (Europe/Paris)**.
- **Limites** : max **5 PR ouvertes** par écosystème.
- **Labels** : `dependencies` + (`backend` | `frontend` | `ci`).
- **Message de commit** : préfixes `chore(deps-backend)`, `chore(deps-frontend)`, `chore(actions)`.

## Règles de merge
- **Patch** (x.y.**z**) → *peut* être **auto-merge** si la **CI est verte**.
- **Minor/Major** → revue manuelle + tests fonctionnels ciblés.
- **Sécurité** : activer les **alertes de vulnérabilités** GitHub et prioriser les PR marquées “security”.

## Workflow
1) **PR auto** ouverte par Dependabot (lundi matin).
2) **CI** : lint + tests → doit être **verte**.
3) **Revue** :
   - Patch → merge direct (ou auto-merge si activé).
   - Minor/Major → validation par reviewer.
4) **CHANGELOG** : mettre à jour la section **Changed/Fixed** si impact visible.

## Vérifications
- Dans GitHub : **Insights → Dependency graph → Dependabot** doit être actif.
- Les labels `dependencies`, `backend`, `frontend`, `ci` existent (sinon PR sans labels — OK).
- Les workflows CI se déclenchent bien sur les PR Dependabot.

## Bonnes pratiques
- Garder le parc “à jour” **régulièrement** pour éviter les sauts majoritaires.
- Sur PR sensible (ex. TypeORM, Nest, React Native), tester **dev + prod** avant merge.
- Si besoin, ignorer temporairement une **major** via options Dependabot et créer un ticket de suivi.