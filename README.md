# QFlow - Smart Queue Management System

Système de gestion de file d'attente intelligent développé avec React Native (Expo) et Firebase Realtime Database.

##  Installation rapide

### 1. Cloner le projet
```bash
git clone <repo-url>
cd QFlow
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Firebase

#### a. Créer votre fichier `.env`
```bash
cp .env.example .env
```

#### b. Obtenir vos credentials Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet **qflow-b7bb0**
3. Cliquez sur  **Paramètres du projet**
4. Dans la section **"Vos applications"**, sélectionnez l'app Web
5. Copiez les valeurs de configuration

#### c. Remplir le fichier `.env`
Remplacez les valeurs dans `.env` avec vos vraies credentials:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=votre_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=qflow-b7bb0.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://qflow-b7bb0-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=qflow-b7bb0
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=qflow-b7bb0.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=votre_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

### 4. Lancer l'application
```bash
npx expo start
```

Scannez le QR code avec l'app **Expo Go** sur votre téléphone.

##  Modes disponibles

- ** TV Display** : Affichage des files d'attente pour écran TV
- ** Staff** : Interface pour le personnel
- ** Client** : Interface pour les clients

## �️ Architecture

Le projet suit une **Feature-First Architecture**:

```
src/
├── features/           # Fonctionnalités par module
│   ├── tv/            # Mode TV Display
│   ├── staff/         # Mode Staff
│   └── client/        # Mode Client
├── shared/            # Code partagé
│   ├── components/    # Composants réutilisables
│   ├── config/        # Configuration (Firebase, theme)
│   └── services/      # Services (Firebase, business logic)
└── navigation/        # Configuration navigation
```

##  Structure Firebase Realtime Database

```json
{
  "queues": {
    "queue_id": {
      "name": "Caisse 1",
      "current_ticket": 5,
      "status": "active"
    }
  },
  "waiting_list": {
    "ticket_id": {
      "queue_id": "queue_id",
      "ticket_number": 10,
      "timestamp": 1234567890,
      "status": "waiting"
    }
  }
}
```

##  Règles de sécurité Firebase (développement)

Actuellement en mode développement avec règles ouvertes:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

 **À mettre à jour avant la production !**

##  Technologies utilisées

- **React Native** (Expo SDK 52)
- **React Navigation** v6
- **Firebase Realtime Database**
- **Expo Vector Icons**

##  Équipe

Projet développé par 4 étudiants en ingénierie (4IIR).

##  Notes importantes

-  **Ne jamais commit le fichier `.env`** - il contient vos credentials Firebase
- Le fichier `.env.example` sert de template pour les autres développeurs
- Assurez-vous que tous les membres de l'équipe ont accès au projet Firebase

## � Problèmes courants

### Erreur "FIREBASE WARNING: Firebase error"
- Vérifiez que votre fichier `.env` existe et contient les bonnes valeurs
- Redémarrez le serveur Expo après avoir modifié `.env`

### Erreur "permission_denied"
- Vérifiez les règles de sécurité dans Firebase Console > Realtime Database > Règles
- En développement, utilisez des règles ouvertes (voir section ci-dessus)

### Expo SDK incompatible
- Assurez-vous d'utiliser Expo Go avec la même version SDK (52)
- Ou mettez à jour le projet: `npx expo install --fix`
