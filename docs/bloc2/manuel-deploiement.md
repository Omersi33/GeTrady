# Manuel de déploiement (local/dev)

## 1) Prérequis
- Node.js 20+, npm
- MySQL/MariaDB
- Expo CLI (`npx expo …`)
- Smartphone avec **Expo Go** (ou émulateur) sur le **même réseau** que le PC

## 2) Base de données
Créer la BDD `getrady` :
```sql
CREATE DATABASE getrady CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 3) Fichiers .env
Backend — getrady-backend/.env

```
TWELVEDATA_API_KEY=a8c63e9316b24068802e68047a73c2e7
TWELVEDATA_TZ=Europe/Paris

DB_HOST=localhost
DB_PORT=3306
DB_USER=nom
DB_PASSWORD=mot-de-passe
DB_NAME=getrady

JWT_SECRET=une-longue-valeur-aleatoire
JWT_EXPIRES=7d

NODE_ENV=development
PORT=3000

CORS_ORIGINS=http://localhost:19006,http://192.168.1.50:19006
```

Frontend — getrady-frontend/.env
```EXPO_PUBLIC_API_URL=http://localhost:3000```

## 4) Installation

Ouvrir le terminal de getrady-backend
- `npm ci`
- `npm run start`

Ouvrir le terminal de getrady-frontend
- `npm ci`
- `npx expo start`
- Ouvrir l’application Expo Go sur le smartphone et scanner le QR code. Parfois, il s'agit du mauvais QR code, alors appuyer sur la touche S pour avoir le bon.

## 5) Vérifications rapides
- API : GET http://localhost:3000/health → 200 attendu.
- App mobile : affichage de l’écran d’accueil et appels API OK.

## 6) Admin
Pour passer admin, aller dans la table `user` de la base, et passer à 1 la colonne `isAdmin` de l'utilisateur souhaité.
