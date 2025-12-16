API Backend – Application d’agence de voyage

Description du projet

Ce projet est une API backend pour une application d’agence de voyage dédiée à la réservation de séjours. Il se concentre exclusivement sur la logique serveur et n’inclut pas de frontend, afin de mettre en valeur les compétences backend et l’architecture de l’application.

L’API permet la gestion complète des voyages (CRUD), incluant la création, la consultation, la modification et la suppression des offres. Un système de rôles et de permissions est en place, permettant à un utilisateur administrateur d’ajouter et d’éditer les voyages disponibles sur la plateforme.

L’application intègre une authentification sécurisée basée sur JWT, avec des routes protégées via des middlewares. Les données sont stockées dans une base MongoDB, manipulée à l’aide de Mongoose, et l’ensemble de la logique asynchrone est implémentée avec async/await, accompagnée d’une gestion centralisée des erreurs.

Ce projet a pour objectif de démontrer mes compétences en développement backend, notamment la conception d’API REST, la gestion de bases de données, la sécurité, le traitement asynchrone et la structuration d’un projet professionnel à l’aide de Express.js et TypeScript.

Fonctionnalités principales

Gestion des voyages (CRUD)
   -	Création, lecture, mise à jour et suppression de voyages.
   -	Chaque voyage contient les informations nécessaires à une réservation (destination, dates, prix, disponibilité, etc.).
Rôles et permissions
   -	Accès administrateur pour la gestion des voyages.
   -	L’administrateur peut ajouter de nouveaux voyages, modifier les voyages existants et supprimer des voyages.
Authentification et sécurité
   -	Authentification basée sur JWT (JSON Web Tokens).
   -	Protection des routes sensibles via des middlewares.
Réservations de voyages
   -	Possibilité pour un utilisateur authentifié de réserver un voyage.
   -	Validation des données avant enregistrement.
Code asynchrone et gestion des erreurs
   -	Utilisation d’async / await.
   -	Gestion centralisée des erreurs.
   -	Réponses API claires et cohérentes.

Technologies utilisées
   -	Node.js / Express.js
   -	TypeScript
   -	MongoDB avec Mongoose
   -	JWT pour l’authentification
   -	CORS pour la gestion des accès cross-origin

Architecture du projet
   -	Architecture inspirée du MVC, avec une séparation claire des responsabilités (routes, controllers, services et modèles)
   -	Utilisation de middlewares pour :
      o	Authentification
      o	Autorisation
      o	Gestion des erreurs
   -	Modèle de données définis avec Mongoose