# Star Auto - Site de Vente de Voitures

Un site web complet de vente de voitures construit avec une stack MERN (MongoDB, Express, React, Node.js).

## 🚀 Fonctionnalités

- **Frontend moderne** avec React + Vite + Tailwind CSS
- **Backend robuste** avec Node.js + Express + MongoDB
- **Authentification sécurisée** avec JWT
- **Gestion des rôles** (Admin / Client)
- **Dashboard Admin** complet (CRUD voitures)
- **Catalogue de véhicules** avec filtres et recherche
- **Design responsive** et animations fluides

## 📁 Structure du Projet

```
star-auto/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Car.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── cars.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── CarCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Cars.jsx
│   │   │   ├── CarDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (local ou cloud)
- npm ou yarn

### 1. Cloner et installer les dépendances

```bash
# Installer les dépendances du backend
cd backend
npm install

# Installer les dépendances du frontend
cd ../frontend
npm install
```

### 2. Configuration de l'environnement

```bash
# Backend
cd backend
cp .env.example .env
# Éditer .env avec vos paramètres

# Frontend - pas besoin de configuration, API configurée via proxy Vite
```

### 3. Lancer MongoDB

Assurez-vous que MongoDB est en cours d'exécution :
```bash
# Sur Windows (si installé localement)
mongod

# Ou utilisez MongoDB Atlas (cloud)
```

### 4. Initialiser la base de données (optionnel)

```bash
cd backend
npm run seed
```

Cela créera :
- Un compte Admin : `admin@starauto.com` / `admin123`
- Un compte Client : `client@starauto.com` / `client123`
- 6 véhicules de démonstration

### 5. Lancer l'application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

L'application sera accessible à :
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:5000

## 🔐 Comptes de Test

| Rôle   | Email                   | Mot de passe |
|--------|-------------------------|--------------|
| Admin  | admin@starauto.com      | admin123     |
| Client | client@starauto.com     | client123    |

## 📄 Pages

### Client
- **/** - Page d'accueil avec hero, statistiques, véhicules en vedette
- **/cars** - Catalogue avec filtres (marque, prix, année)
- **/cars/:id** - Détails d'un véhicule
- **/login** - Connexion
- **/register** - Inscription

### Admin
- **/admin** - Dashboard avec statistiques et gestion des véhicules
- CRUD complet (Créer, Modifier, Supprimer des véhicules)

## 🎨 Design

- **Couleurs principales** : Bleu foncé (#1e3a5f), Noir (#0a1628), Rouge (#e63946), Orange (#f77f00)
- **Framework CSS** : Tailwind CSS
- **Icônes** : SVG (via Heroicons)
- **Police** : Inter

## 🔧 Technologies

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3.4
- React Router DOM 6
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Token)
- Bcryptjs

## 📝 API Endpoints

### Auth
| Méthode | Endpoint         | Description           | Accès |
|---------|------------------|-----------------------|-------|
| POST    | /api/auth/register | Inscription          | Public |
| POST    | /api/auth/login    | Connexion            | Public |
| GET     | /api/auth/me       | Profil utilisateur   | Private |

### Voitures
| Méthode | Endpoint      | Description            | Accès |
|---------|---------------|------------------------|-------|
| GET     | /api/cars     | Liste des voitures     | Public |
| GET     | /api/cars/:id | Détails d'une voiture  | Public |
| POST    | /api/cars     | Créer une voiture      | Admin |
| PUT     | /api/cars/:id | Modifier une voiture   | Admin |
| DELETE  | /api/cars/:id | Supprimer une voiture  | Admin |

## 🚀 Déploiement

### Backend (Render, Heroku, etc.)
1. Configurer les variables d'environnement
2. Connecter à MongoDB Atlas
3. Déployer

### Frontend (Vercel, Netlify, etc.)
1. Modifier `vite.config.js` pour pointer vers l'URL de production
2. Déployer

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

---

Créé avec ❤️ par Star Auto
