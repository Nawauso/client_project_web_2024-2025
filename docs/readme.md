# Netflux

Application React qui consomme un back-end Express pour recommander et trier des films issus de l’API TMDB.

Netflux permet de marquer les films aimés / non aimés / déjà vus seul ou en groupe, puis d’afficher d’abord ce qui a le plus de chances de plaire.

Client : https://github.com/La229028/client_project_web_2024-2025
Serveur : https://github.com/La229028/server_projet_web_2024-2025
TMDB : https://www.themoviedb.org/

Fonctionnalités
Authentification JWT (vérification automatique du token).
Gestion des critères (genres & providers) par utilisateur.
Groupes : création / rejoindre, priorisation de films partagée.
Page Favoris (type Tinder) : like / dislike / passer, avec gestures (swipe).
Page Principal (Home) :
- d’abord les films priorisés positivement par le groupe (ou les préférés de l’utilisateur s’il n’a pas de groupe),
- puis les films correspondant aux genres/providers sélectionnés par le groupe,
- puis un fallback sur le catalogue par défaut,
- scroll infini + cache local pour conserver l’ordre entre les refresh.
  Seed auto des genres, providers et comptes démo.

Comptes démo (créés au boot serveur) :

admin@cool.com / admin
user@cool.com / user

Prérequis
Node.js 18+
Un token TMDB v4 (Bearer) — à placer dans le .env du serveur.

# Installation & Lancement
## 1) Cloner les deux dépôts
### client

git clone https://github.com/La229028/client_project_web_2024-2025.git

cd client_project_web_2024-2025

npm install
# Serveur (dans une autre fenêtre)
git clone https://github.com/La229028/server_projet_web_2024-2025.git

cd server_projet_web_2024-2025

npm install

## 2) Configurer le serveur
   Copier .env.sample en .env et renseigner au minimum :
- JWT_SECRET
- TMDB_V4_TOKEN (token v4 TMDB)
  Par défaut, la base est un fichier SQLite (DB_PATH=Netflux.db) créé automatiquement.
### Lancer le serveur en dev (http://localhost:8080)
npm run dev
Au premier démarrage, les genres, providers et utilisateurs sont seedés automatiquement.
Les appels TMDB nécessitent un token valide.

## 3) Lancer le client
   Le client est déjà configuré pour consommer http://localhost:8080/api.
## Dans le dossier client
npm run dev

Client : http://localhost:5173

Serveur API : http://localhost:8080/api

Structure (côté client)
src/components
- NetfluxPage.tsx : page d’accueil, flux trié + scroll infini + cache.
- FavoritePage.tsx : like/dislike/passer avec swipe.
- CriteriaPage.tsx : sélection des genres & providers.
- AuthContext.tsx : gestion du token & session.
- ContextNetfluxProvider.tsx : état global (groupe, filtres, etc.).
- AxiosInstance.ts : instance HTTP configurée sur /api.

Flot de données
- Login → le token est stocké en local, vérifié au boot.
- Critères : l’utilisateur choisit genres et providers (persistés côté serveur).
- Favoris :
    * le client récupère des films (TMDB → backend) filtrés par les critères,
    * l’utilisateur aime / n’aime pas / passe (envoi au serveur),
    * en groupe : le serveur met à jour la priorité de groupe (bornée à -1 min pour “blacklist”).
- Principal :
    * tri par priorité de groupe > 0 en premier,
    * puis films correspondant aux catégories du groupe,
    * puis catalogue par défaut,
    * exclusion des films “blacklistés” par le groupe,
    * le flux se met en cache (localStorage) et se prolonge au scroll.

Scripts utiles

Client :

npm run dev        # démarre Vite en développement

npm run build      # build de production (sortie /dist)

Serveur :

npm run dev        # démarre le serveur (ts-node + nodemon)

Dépannage rapide
- 401 / 403 côté client : le token est invalide ou expiré → reconnectez-vous.
- 500 au premier appel TMDB : vérifiez TMDB_V4_TOKEN dans le .env du serveur.
- 404 /api/films : assurez-vous que le serveur écoute bien sur http://localhost:8080 et que le client pointe vers /api.
- Aucun film en home : cliquez sur Réinitialiser (Home) pour vider le cache local et relancer la première page.
- Seeds en erreur UNIQUE : les seeds sont idempotents, mais si vous changez de DB, supprimez l’ancien fichier SQLite ou corrigez DB_PATH.

### Licence Projet académique – usage pédagogique.

# lien vidéo
https://youtu.be/LY7pCXfE9es
