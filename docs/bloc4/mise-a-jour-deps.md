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
- **Sécurité** : prioriser les PR marquées **security** (GitHub advisories).

## Workflow de traitement
1) PR auto ouverte par Dependabot (lundi matin).
2) **CI** : lint + tests → doit être **verte**.
3) **Revue** :
   - Patch → merge direct (ou auto-merge si activé).
   - Minor/Major → validation par reviewer.
4) **CHANGELOG** : mettre à jour la section **Changed/Fixed** si impact visible.

## Conflits de peerDependencies (ex. React 19 / React-DOM 19.1)
- Ne **pas** utiliser `--force` en CI.
- Aligner les versions majeures impliquées (React / React-DOM / RN Web…).
- Si blocage, **fermer la PR** et ouvrir un ticket “Montée de version coordonnée”.

## Rerun CI
- Bouton **Re-run jobs** dans l’onglet *Actions* de la PR.
- Ou commit vide :  
  `git commit --allow-empty -m "ci: rerun"` puis `git push`.

## Vérifications
- GitHub : **Insights → Dependency graph → Dependabot** doit être actif.
- Les labels `dependencies`, `backend`, `frontend`, `ci` existent (sinon PR sans labels — acceptable).
- Les workflows CI se déclenchent bien sur les PR Dependabot.

## Bonnes pratiques
- Mettre à jour **régulièrement** pour éviter les gros gaps de versions.
- Sur PR sensible (Nest, RN, TypeORM…), tester **dev + prod** avant merge.
- Si nécessaire, ignorer temporairement une **major** dans `dependabot.yml` et créer un ticket de suivi.