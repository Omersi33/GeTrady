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

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=nom
DB_PASSWORD=mot-de-passe
DB_NAME=getrady

JWT_SECRET=une-longue-valeur-aleatoire
JWT_EXPIRES=7d

NODE_ENV=development
PORT=3000

CORS_ORIGINS=http://localhost:19006,http://127.0.0.1:19006,http://adresse-ip-publique:19006
```

Frontend — getrady-frontend/.env

```EXPO_PUBLIC_API_URL=http://adresse-ip-publique:3000```

Dans ces fichiers .env, remplacer `nom`, `mot-de-passe`, `une-longue-valeur-aleatoire` et `adresse-ip-publique` par les valeurs correspondantes.

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

## 6) Données
Pour tester l'application, il va falloir ajouter des actifs (crypto etc). En tant qu'admin, c'est possible. Ou alors simplement exécuter la requête à la fin du fichier.
Ajouter des noms de symboles existant (exemple : 'BTCUSD', 'ETHUSD', 'XAUUSD') avec les indicateurs RSI, MACD et BB souhaités, des notifications s'enverront quand un signal BUY ou SELL sera détecté. L'analyse est faite toutes les minutes sauf en week-end.
```sql
INSERT INTO `asset`
(`symbol`,`lastUpdate`,`currentValue`,`advice`,`TP1`,`TP2`,`TP3`,`SL`,`maFast`,`maSlow`,`rsiLo`,`rsiHi`,`bbPeriod`,`bbStdDev`)
VALUES
('BTC/USD','2025-08-21 00:00:00',0,'WAIT',0,0,0,0,13,19,17,76,15,1.8),
('XAU/USD','2025-08-21 00:00:00',0,'WAIT',0,0,0,0,6,14,30,70,20,1.9),
('ETH/USD','2025-08-21 00:00:00',0,'WAIT',0,0,0,0,5,12,72,73,18,1.8),
('SOL/USD','2025-08-21 00:00:00',0,'WAIT',0,0,0,0,7,16,26,74,20,2.0),
('WTI/USD','2025-08-21 00:00:00',0,'WAIT',0.,0,0,0,6,15,31,69,18,1.9);
```
