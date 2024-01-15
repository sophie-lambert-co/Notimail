
# Notimail-Back-CDA

## Table des matières

- [Installation de l'environnement](#installation-de-lenvironnement)
  - [Docker](#docker)
    - [Installation de Docker](#installation-de-docker)
    - [Installation de Docker Desktop sur Mac](#installation-de-docker-desktop-sur-mac)
    - [Création d'un conteneur avec l'image phpMyAdmin](#création-dun-conteneur-avec-limage-phpmyadmin)
  - [Git / GitHub](#git--github)
  - [Git / GitHub](#git--github)
    - [Installation de Git](#installation-de-git)
    - [Utilisation de Git avec GitHub](#utilisation-de-git-avec-github)
- [Installation](#installation)
  - [Lancer le conteneur Docker MySQL](#lancer-le-conteneur-docker-mysql)
  - [Accéder au conteneur MySQL](#accéder-au-conteneur-mysql)
  - [Créer la base de données MySQL](#créer-la-base-de-données-mysql)
- [Environnement de l'application NOTIMAIL](#environnement-de-lapplication-notimail)
- [Structure des fichiers](#structure-des-fichiers)
- [Sécurisation du site](#sécurisation-du-site)
  - [dotenv](#dotenv)
    - [Installation de dotenv](#installation-de-dotenv)
    - [Utilisation de dotenv](#utilisation-de-dotenv)
  - [bcrypt](#bcrypt)
    - [Installation de bcrypt](#installation-de-bcrypt)
    - [Utilisation de bcrypt](#utilisation-de-bcrypt)
  - [JSON Web Tokens (JWT)](#json-web-tokens-jwt)
    - [Installation de jsonwebtoken](#installation-de-jsonwebtoken)
- [Compte administrateur](#compte-administrateur)
- [Envoi d'e-mails](#envoi-de-mails)
- [CORS (Cross-Origin Resource Sharing)](#cors-cross-origin-resource-sharing)
  - [Installation de cors](#installation-de-cors)
  - [Configuration dans serveur.js](#configuration-dans-serveurjs)
- [À faire](#à-faire)

## Installation de l'environnement

### Node.js

Téléchargez la dernière version de Node.js à partir du site officiel : Télécharger Node.js

Suivez les instructions du programme d'installation.

```bash

npm --version

```

Si npm n'est pas installé, vous pouvez l'obtenir en installant à nouveau Node.js à partir du site officiel.

Versions requises
Assurez-vous d'utiliser des versions compatibles de Node.js et npm pour garantir le bon fonctionnement de l'application NOTIMAIL. 

Versions requises pour ce projet :

Node.js version v20.10.0
npm version 10.2.3
Vous pouvez vérifier les versions installées en utilisant les commandes suivantes :

```bash

# Vérifiez la version de Node.js
node --version

# Vérifiez la version de npm
npm --version

```

Si les versions installées ne correspondent pas aux versions recommandées, vous pouvez les mettre à jour en utilisant les gestionnaires de versions appropriés ou en téléchargeant les versions spécifiques depuis le site officiel de Node.js.

### npm (Node Package Manager)

npm est généralement inclus avec Node.js. Cependant, il est recommandé de vérifier si vous disposez de la dernière version en exécutant la commande suivante dans votre terminal ou votre invite de commande :

### Docker

[Docker](https://www.docker.com/) est une plateforme qui facilite le déploiement d'applications dans des conteneurs. Assurez-vous de l'installer avant de poursuivre.

#### Installation de Docker

Suivez les instructions sur le site officiel de Docker pour installer Docker sur votre système d'exploitation :

- [Installer Docker](https://docs.docker.com/get-docker/)

#### Installation de Docker Desktop sur Mac

1. Téléchargez Docker Desktop pour Mac à partir du site officiel de Docker : [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac/).

2. Suivez les instructions d'installation pour Docker Desktop.

Vérification de l'installation

Après avoir installé Docker, vous pouvez vérifier si l'installation s'est bien déroulée en exécutant les commandes suivantes dans votre terminal ou invite de commande :

```bash

# Vérifiez la version de Docker
docker --version

# Vérifiez la version de Docker Compose (le cas échéant)
docker-compose --version

# Vérifiez si Docker est opérationnel en exécutant un conteneur de test
docker run hello-world

```

Si tout est correctement installé, ces commandes devraient retourner des informations sur les versions et exécuter le conteneur de test avec succès.

Version recommandée pour ce projet : Docker version 24.0.7

#### Création d'un conteneur avec l'image phpMyAdmin

```bash
# Téléchargez l'image phpMyAdmin depuis Docker Hub
docker pull phpmyadmin/phpmyadmin

# Créez un réseau Docker pour la communication entre les conteneurs
docker network create notimail-network

# Lancez un conteneur MySQL avec le réseau créé
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root --network notimail-network mysql:latest

# Lancez un conteneur phpMyAdmin connecté au réseau
docker run -d --name phpmyadmin -e PMA_HOST=mysql --network notimail-network -p 8080:80 phpmyadmin/phpmyadmin

```

Après ces étapes, vous pourrez accéder à phpMyAdmin via <http://localhost:8080> dans votre navigateur. Utilisez le nom d'utilisateur "root" et le mot de passe "root" pour vous connecter à MySQL via phpMyAdmin.

### Git / GitHub

[Git](https://git-scm.com/) est un système de contrôle de version, et [GitHub](https://github.com/) est une plateforme d'hébergement de code.

#### Installation de Git

Si Git n'est pas encore installé sur votre machine, suivez les instructions ici :

- [Installer Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

#### Utilisation de Git avec GitHub

1. **Clonez le dépôt :**

```bash

git clone https://github.com/votre_utilisateur/votre_projet.git
cd votre_projet

```

- Contribuez au projet :

Ajoutez vos modifications avec git add.
Validez les modifications avec git commit -m "Votre message de commit".
Envoyez les modifications sur GitHub avec git push.

```bash

git add .
git commit -m "Ajout d'une fonctionnalité"
git push

```

- Récupérez les mises à jour :

Si d'autres contributeurs ont apporté des modifications, vous pouvez les récupérer avec :

```bash

git pull origin master

```

## Installation

```bash

# Lancer le conteneur Docker MySQL
docker run -d -p 3307:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:latest

# Accéder au conteneur MySQL
docker exec -it mysql sh

# Se connecter à MySQL et créer la base de données
mysql -u root -p

# (entrer le mot de passe root)
create database NOTIMAIL;

```

Les étapes ci-dessus vous permettront de créer un environnement de développement fonctionnel et d'installer les outils nécessaires pour travailler sur votre application. Assurez-vous d'avoir Docker et Git installés avant de commencer.

## Environnement de l'application NOTIMAIL

- Docker
- NodeJS
- bcrypt : "^5.1.1", Bcrypt hache les MDP avant de les stocker dans la BDD et vérifie les MDP hachés lors de l'authentification.
- body-parser : "^1.20.2",
- cors : "^2.8.5",
- dotenv : "^16.3.1",
- express : "^4.18.2",
- jsonwebtoken : "^9.0.2", JWT est utilisé pour créer des tokens d'authentification.
- morgan : "^1.10.0",
- mysql : "^2.18.1",
- mysql2 : "^3.6.5",
- nodemailer : "^6.9.8",
- nodemon : "^3.0.2",
- sequelize : "^6.35.2"

## Structure des fichiers

- connectDB: Création d'une instance Sequelize.
- serveur: Point d'entrée de l'application.
- modeles
  - modelUser: Création du modèle et de la table "users".
- controllers
  - userController: Gestion des fonctions du CRUD.
  - authController : Gestion des fonctions pour l'authetification des users + hashage mot de pass
  - admincontroller : Gestion de la fonction de creation de l'administrateur principal au lancement de l'application
- routes
  - userRoute: Création des routes pour le CRUD de la table "users".
- .env : Stock les variables d'environnement
- middlewares
  - authMiddleware : Middleware d'authetification, Il sert de pont entre le client (le navigateur de l'utilisateur) et le serveur.
- utils
 - emailConfig :
 - utils :

### connectDB.js

Ce fichier est responsable de la création d'une instance Sequelize qui sert de connexion à la base de données MySQL. Il utilise les informations de connexion provenant du fichier .env pour configurer cette instance. L'objet connection est ensuite exporté, permettant aux autres parties de l'application d'interagir avec la base de données en utilisant Sequelize.

Ce fichier est crucial pour l'interaction de l'application avec la base de données, assurant une gestion centralisée de la connexion et de la configuration de Sequelize.

### app.js

Le fichier principal app.js sert de point d'entrée pour l'application NOTIMAIL. Il utilise Express pour créer une application web, configure les middlewares tels que Morgan pour les logs et CORS pour la gestion des requêtes cross-origin. De plus, il initialise la connexion à la base de données, configure les routes, synchronise le modèle User avec la base de données, et démarre le serveur.

### modelUser.js

Le fichier modelUser.js définit le modèle User pour la table des utilisateurs dans la base de données. Il utilise Sequelize pour définir la structure des attributs, y compris le nom de la société, le prénom, le nom, l'e-mail, le numéro de téléphone, le mot de passe, etc. Ce modèle permet une interaction facilitée avec la base de données et est crucial pour la gestion des données utilisateur dans l'application NOTIMAIL.

### userController.js

Le fichier userController.js contient la classe userController, responsable de la gestion des différentes actions liées aux utilisateurs dans l'application NOTIMAIL. Il importe les modules nécessaires, tels que connectDB.js, modelUser.js, bcrypt, utils.js, emailConfig.js, et Sequelize. Cette classe comprend des méthodes asynchrones pour créer un nouvel utilisateur, récupérer tous les utilisateurs, récupérer un utilisateur par son nom d'entreprise, mettre à jour un utilisateur, supprimer un utilisateur, et envoyer des notifications par e-mail.

Méthodes Principales :

**createUser**: Crée un nouvel utilisateur en utilisant les données reçues dans la requête. Génère un code utilisateur aléatoire s'il n'y a pas de mot de passe dans la requête.

**getAllUser**: Récupère tous les utilisateurs depuis la base de données.

**getUserByFirmName**: Récupère un utilisateur par son nom d'entreprise (firm_name).

**updateUser**: Met à jour un utilisateur par son firm_name en utilisant les données fournies dans le corps de la requête. Envoie également un e-mail de notification pour informer l'utilisateur des modifications.

**deleteUser**: Supprime un utilisateur par son firm_name depuis la base de données.

**sendNotification**: Envoie des notifications par e-mail à plusieurs utilisateurs en fonction de la liste fournie dans la requête. Met à jour le statut des utilisateurs pour indiquer qu'ils ont du courrier.

Le fichier facilite la gestion complète du cycle de vie des utilisateurs dans l'application.

### adminController.js

Le fichier adminController.js contient une fonction createAdminUser qui génère un compte administrateur avec un mot de passe haché et le sauvegarde dans la base de données. Il importe le modèle d'utilisateur (modelUser.js) ainsi que la fonction generateAdminPassword du fichier utils.js.

Fonction Principale :

**createAdminUser**: Génère un mot de passe administrateur haché en utilisant la fonction **generateAdminPassword**. Ensuite, crée un utilisateur avec des informations prédéfinies telles que le prénom, le nom, le nom de l'entreprise, l'adresse e-mail, le numéro de téléphone, le mot de passe haché, le statut administrateur, et un indicateur de courrier. Cette fonction est appelée au lancement de l'application pour créer le compte administrateur principal.
Le fichier facilite la création du compte administrateur avec des informations par défaut et un mot de passe sécurisé.

### loginUser.js

Le fichier loginUser.js contient les fonctionnalités de gestion des tokens d'authentification dans le contexte de la sécurité informatique. Il utilise JSON Web Tokens (JWT) pour créer et gérer ces tokens. La fonction **generateToken** génère un token JWT sécurisé basé sur les données de l'utilisateur, tandis que la fonction **loginUser** gère le processus d'authentification, génère le token, et le stocke dans un cookie sécurisé pour une utilisation ultérieure lors des requêtes à l'API.

### userRoutes.js

Gestion des Routes Utilisateur
Le fichier userRoutes.js importe le module Router depuis Express pour créer les routes associées aux fonctionnalités de gestion des utilisateurs. Ces routes sont définies en utilisant le contrôleur userController.js, qui gère les opérations CRUD sur les utilisateurs. Le fichier inclut également des fonctionnalités liées à l'authentification et à la création d'un administrateur. Les différentes routes permettent de créer, récupérer, mettre à jour, et supprimer des utilisateurs, ainsi que de gérer l'authentification et l'envoi de notifications.


### Fichier .env

Configuration de l'Application
Le fichier .env est crucial pour la configuration de l'application. Il contient les informations sensibles nécessaires pour la connexion à la base de données et d'autres paramètres. Voici un aperçu des variables définies dans le fichier :

DB_NAME: Le nom de la base de données
DB_USER: L'utilisateur de la base de données
DB_PASS: Le mot de passe de la base de données
DB_HOST: L'adresse de l'hôte de la base de données
DB_PORT: Le port utilisé pour la connexion à la base de données
De plus, des informations liées à la sécurité et à l'authentification sont également spécifiées :

JWT_SECRET: La clé secrète utilisée pour sécuriser et signer les tokens JWT
MAIL_ADRESS: L'adresse e-mail utilisée pour les notifications
MAIL_PASSWORD: Le mot de passe associé à l'adresse e-mail utilisé pour l'envoi des notifications.
Il est impératif de garder ces informations confidentielles et de ne pas les partager publiquement pour des raisons de sécurité.

### authenticateUser.js

Middleware d'Authentification
Ce fichier contient un middleware essentiel pour l'authentification des utilisateurs dans l'application. Voici une brève description de son rôle et de son utilisation :

jsonwebtoken (JWT) : Importe la bibliothèque JSON Web Token (JWT) nécessaire pour générer, signer et vérifier les tokens d'authentification.

secretKey : Définit la clé secrète utilisée pour la signature et la vérification des tokens JWT. Cette clé doit rester confidentielle et sécurisée.

authenticateUser Middleware : La fonction middleware **authenticateUser** assure l'authentification des utilisateurs. Elle est conçue pour être utilisée comme middleware dans les routes nécessitant une authentification. Voici son fonctionnement :

Récupère le token d'authentification depuis le cookie de la requête (supposant qu'il est stocké dans un cookie appelé "token").

Vérifie la présence du token dans la requête. Si aucun token n'est trouvé, renvoie une erreur 401 (Non autorisé) indiquant que l'authentification est requise.

Vérifie la validité du token en le décodant à l'aide de la clé secrète. Si le token est invalide, renvoie une erreur 401 (Non autorisé) indiquant qu'il est invalide.

Si le token est valide, stocke les informations de l'utilisateur décodées dans l'objet de requête (req.user).

Passe au middleware suivant ou à la fonction de routage suivante.

Ce middleware garantit que seuls les utilisateurs authentifiés peuvent accéder aux routes protégées, renforçant ainsi la sécurité de l'application.

```bash

Un middleware est une fonction intermédiaire dans une application web, intervenant entre la réception d'une requête et le traitement effectif par la route correspondante. Il peut effectuer des actions comme l'authentification, la validation, ou la modification de la requête, et permet de modulariser la logique de l'application.

```

### nodemailer.js

Module d'Envoi d'E-mails - 
Le fichier emailConfig.js facilite l'envoi d'e-mails dans votre application en utilisant le module Nodemailer. Voici un aperçu de son fonctionnement :

Configuration du Transporteur SMTP :
Le fichier définit un transporteur SMTP en utilisant le service Gmail comme fournisseur de messagerie. La configuration inclut l'adresse e-mail principale de l'administrateur (MAIL_ADRESS) et le mot de passe associé (MAIL_PASSWORD).

Fonction pour Envoyer un E-mail :
Le fichier expose une fonction sendEmail qui prend en paramètre un objet mailOptions détaillant les informations de l'e-mail à envoyer (destinataire, sujet, texte, etc.). La fonction renvoie une promesse, permettant de gérer facilement les succès et les erreurs lors de l'envoi.

Intégrez ce module dans votre application pour mettre en place une fonctionnalité d'envoi d'e-mails de manière sécurisée et fiable.

## Sécurisation du site

### dotenv

dotenv est utilisé pour charger les variables d'environnement à partir d'un fichier .env.
Le fichier .env ne doit pas être partagé ou exposé publiquement, car il peut contenir des informations sensibles comme les clés secrètes.

Installation de dotenv

```bash

npm install dotenv

```

Utilisation de dotenv
Créez un fichier .env à la racine de votre projet et définissez vos variables d'environnement :

```bash

env
Copy code
DB_HOST=localhost
DB_USER=user
DB_PASS=password
PORT=3000
JWT_SECRET=mysecretkey

```

Chargez les variables d'environnement au début de votre application :

```bash

require('dotenv').config();

```

### bcrypt

Bcrypt est utilisé pour le hachage sécurisé des mots de passe.
La sécurisation des mots de passe est essentielle pour garantir la sécurité des utilisateurs. Le hachage sécurisé des mots de passe avec bcrypt est une pratique recommandée, offrant une protection robuste contre les attaques par force brute. Pour intégrer cette fonctionnalité dans votre application, installez bcrypt à l'aide de la commande suivante :

Installation de bcrypt

```bash

npm install bcrypt

```

Utilisez ensuite bcrypt pour hacher les mots de passe avant de les stocker dans la base de données. Lors de l'authentification, vérifiez les mots de passe hachés pour garantir une sécurité optimale.

### JSON Web Tokens (JWT)

JWT est utilisé pour créer des tokens d'authentification.

Installation de jsonwebtoken

```bash

npm install jsonwebtoken

```

### CORS (Cross-Origin Resource Sharing)

Cross-Origin Resource Sharing (CORS) est une mesure de sécurité qui contrôle l'accès aux ressources d'un site web depuis un autre domaine. Pour configurer CORS dans votre application, installez le package CORS avec la commande suivante :

```bash

npm install cors

```

Intégrez CORS dans votre application en utilisant le code suivant :

```bash

var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'});
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
});

```

## Fonctionalitées du site

### Compte administrateur

Création d'un compte administrateur en utilisant await User.sync({ force: true }).
Cryptage automatique du mot de passe.
Création des comptes utilisateur dans le contrôleur avec génération automatique (ou non) d'un mot de passe à 4 chiffres crypté.

### Envoi d'e-mails

Configuration de l'envoi d'e-mails automatiques dans votre application Node.js.
Installation de Nodemailer:

```bash

npm install nodemailer

```

Créez un fichier de configuration dédié pour Nodemailer et intégrez-le dans votre application principale. Utilisez cet exemple pour comprendre comment implémenter le module dans des scénarios courants où l'envoi d'e-mails est nécessaire.

###### remettre la table des matières
