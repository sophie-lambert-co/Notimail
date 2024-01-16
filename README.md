
# Notimail-Back-CDA

Notimail est une application de gestion de courrier, pour une entreprise de domiciliation.
La domiciliation comprend la réception du courrier professionnel et sa notification par mail.

## Table des matières

- **[Installation de l'environnement](#installation-de-lenvironnement)**

  - [Node.js]
  - [npm] (#Node Package Manager)
  - [Docker](#docker)
    - [Installation de Docker](#installation-de-docker)
    - [Vérification de l'installation de Docker](#verification-de-linstallation-de-docker)
    - [Installation de Docker Desktop sur Mac](#installation-de-docker-desktop-sur-mac)
    - [Création d'un conteneur avec l'image phpMyAdmin](#creation-dun-conteneur-avec-limage-phpmyadmin)
  - [Git / GitHub](#git--github)
    - [Installation de Git](#installation-de-git)
    - [Utilisation de Git avec GitHub](#utilisation-de-git-avec-github)

- **[Installation](#installation)**

  - [Lancer le conteneur Docker MySQL](#lancer-le-conteneur-docker-mysql)
  - [Accéder au conteneur MySQL](#accéder-au-conteneur-mysql)
  - [Créer la base de données MySQL](#créer-la-base-de-données-mysql)

- **[Structure de l'application NOTIMAIL](#structure-de-lapplication-notimail)**

  - [Structure des fichiers](#structure-des-fichiers)
    - [connectDB.js](#connectdbjs)
    - [serveur.js](#serveurjs)
    - modeles
      - [modelUser.js](#modeluserjs)
    - controllers
      - [userController.js](#usercontrollerjs)
      - [adminController.js](#admincontrollerjs)
      - [authController.js](#authcontrollerjs)
    - routes
      - [userRoutes.js](#userroutesjs)
    - utils
      - [emailConfig.js](#emailconfigjs)
      - [swaggerConfig.js](#swaggerconfigjs)
      - [utilSecurisation.js](#utilsecurisationjs)
    - [.env](#env)
    - [request.rest](#requestrest)

- **[Sécurisation du site](#sécurisation-du-site)**
  - [dotenv](#dotenv)
    - [Installation de dotenv](#installation-de-dotenv)
    - [Utilisation de dotenv](#utilisation-de-dotenv)
  - [bcrypt](#bcrypt)
    - [Installation de bcrypt](#installation-de-bcrypt)
    - [Utilisation de bcrypt](#utilisation-de-bcrypt)
  - [JSON Web Tokens (JWT)](#json-web-tokens-jwt)
    - [Installation de jsonwebtoken](#installation-de-jsonwebtoken)
  - [CORS (Cross-Origin Resource Sharing)](#cors-cross-origin-resource-sharing)
  - [Installation de cors](#installation-de-cors)
  - [Configuration dans serveur.js](#configuration-dans-serveurjs)

- **[Fonctionnalités du site](#fonctionnalités-du-site)**
  - [Compte administrateur](#compte-administrateur)
  - [Envoi d'e-mails avec Nodemailer](#envoi-de-mails-avec-Nodemailer)
    - Installation de Nodemailer
    - Configuration de l'envoi de sms
    - Exemple d'utilisation de Nodemailer
  - [Envoi de SMS avec AllMySms](#envoi-de-sms-avec-allmysms)
    - Prérequis
    - Installation
    - Configuration de AllMySms
    - Utilisation
    - [API Documentation](https://doc.allmysms.com/api/fr/)
  - [Swagger UI](#swagger-ui)
    - Prérequis
    - Installation
    - Configuration de Sawagger
    - Utilisation

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine avant de commencer

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

- **Installation de Docker**

Suivez les instructions sur le site officiel de Docker pour installer Docker sur votre système d'exploitation sur le site officiel :

- [Installer Docker](https://docs.docker.com/get-docker/)

- **Installation de Docker Desktop sur Mac**

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

- **Création d'un conteneur avec l'image phpMyAdmin**

Pour faciliter la gestion de la base de données, vous pouvez utiliser phpMyAdmin dans un conteneur Docker. Suivez ces étapes pour créer le conteneur :

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

- **Installation de Git**

Si Git n'est pas encore installé sur votre machine, suivez les instructions ici :
Téléchargez et installez Git à partir du site officiel :
[Git](https://git-scm.com/) est un système de contrôle de version, et [GitHub](https://github.com/) est une plateforme d'hébergement de code.

- [Installer Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

**Utilisation de Git avec GitHub**

Assurez-vous d'avoir un compte GitHub et configurez Git avec vos informations d'identification :

```bash

# Configurez votre nom d'utilisateur
git config --global user.name "VotreNom"

# Configurez votre adresse e-mail
git config --global user.email "votre@email.com"

```

1. **Clonez le dépôt :**

- Clonez le référentiel depuis GitHub :

```bash

git clone https://github.com/votre_utilisateur/votre_projet.git
cd votre_projet

```

- Accédez au répertoire de l'application :

```bash

cd nom-de-votre-application

```

- Installez les dépendances

```bash

npm install

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

## Installation de l'application

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

## Structure de l'application NOTIMAIL

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

### Structure des fichiers

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
  - emailConfig : Module d'Envoi d'E-mails
  - utilSecurisation : Module de Validation et Génération de Mot de Passe
  - swaggerConfig : configuration de Swagger UI

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

### authController.js

Le fichier loginUser.js contient les fonctionnalités de gestion des tokens d'authentification dans le contexte de la sécurité informatique. Il utilise JSON Web Tokens (JWT) pour créer et gérer ces tokens. La fonction **generateToken** génère un token JWT sécurisé basé sur les données de l'utilisateur, tandis que la fonction **loginUser** gère le processus d'authentification, génère le token, et le stocke dans un cookie sécurisé pour une utilisation ultérieure lors des requêtes à l'API.

### userRoutes.js

Gestion des Routes Utilisateur
Le fichier userRoutes.js importe le module Router depuis Express pour créer les routes associées aux fonctionnalités de gestion des utilisateurs. Ces routes sont définies en utilisant le contrôleur userController.js, qui gère les opérations CRUD sur les utilisateurs. Le fichier inclut également des fonctionnalités liées à l'authentification et à la création d'un administrateur. Les différentes routes permettent de créer, récupérer, mettre à jour, et supprimer des utilisateurs, ainsi que de gérer l'authentification et l'envoi de notifications.

### .env

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

### authMiddleware.js

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

### emailConfig.js

Le fichier emailConfig.js facilite l'envoi d'e-mails dans votre application en utilisant le module Nodemailer. Voici un aperçu de son fonctionnement :

Configuration du Transporteur SMTP :
Le fichier définit un transporteur SMTP en utilisant le service Gmail comme fournisseur de messagerie. La configuration inclut l'adresse e-mail principale de l'administrateur (MAIL_ADRESS) et le mot de passe associé (MAIL_PASSWORD).

Fonction pour Envoyer un E-mail :
Le fichier expose une fonction **sendEmail** qui prend en paramètre un objet mailOptions détaillant les informations de l'e-mail à envoyer (destinataire, sujet, texte, etc.). La fonction renvoie une promesse, permettant de gérer facilement les succès et les erreurs lors de l'envoi.

### utilSecurisation.js

Le fichier utils.js offre des fonctionnalités cruciales pour la sécurité et la gestion des utilisateurs dans votre application. Voici un aperçu de ses principales fonctions :

Vérification de l'Existence d'un firm_name :

Une fonction asynchrone **verifyFirmName** vérifie la disponibilité d'un firm_name dans la base de données. Elle renvoie true si le firm_name existe déjà et false s'il est disponible.

Génération de Mot de Passe Administrateur :

La constante saltRounds définit le nombre de tours de salage pour le hachage des mots de passe.
Une fonction asynchrone **generateAdminPassword** génère un mot de passe administrateur haché avec le salage spécifié. Vous pouvez personnaliser le mot de passe dans la fonction selon vos besoins.
Ces utilitaires sont essentiels pour assurer la sécurité des mots de passe, vérifier l'unicité des firm_names et générer des mots de passe administrateurs de manière sécurisée.

### swaggerConfig.js

Ce fichier utilise les bibliothèques swagger-jsdoc et swagger-ui-express pour générer la documentation Swagger (OpenAPI) de l'API. Il configure les options, génère la spécification OpenAPI, et exporte les spécifications ainsi que l'interface utilisateur Swagger. La spécification est basée sur le fichier userRoutes.js.

Swagger UI : Une interface utilisateur qui génère une documentation interactive basée sur le fichier OpenAPI. Cela facilite la compréhension de l'API, l'exploration des points de terminaison, et même l'essai des requêtes directement depuis la documentation.

## Sécurisation du site et configuration

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

### Base de données

L' application utilise une base de données SQL pour stocker les informations des utilisateurs. La base de données est créée au fur et à mesure que les utilisateurs s'inscrivent. Assurez-vous de configurer correctement votre base de données en suivant les étapes ci-dessous :

- **Configuration de la base de données**

Création automatique des tables : Les tables nécessaires seront créées automatiquement lorsqu'un utilisateur s'inscrit pour la première fois. Cela est géré par Sequelize, le framework ORM utilisé dans l'application.

Paramètres de connexion : Assurez-vous que les paramètres de connexion à la base de données sont corrects. Ils sont définis dans le fichier .env.

Base de données
Votre application utilise une base de données SQL pour stocker les informations des utilisateurs. La base de données est créée au fur et à mesure que les utilisateurs s'inscrivent. Assurez-vous de configurer correctement votre base de données en suivant les étapes ci-dessous :

Configuration de la base de données
Création automatique des tables : Les tables nécessaires seront créées automatiquement lorsqu'un utilisateur s'inscrit pour la première fois. Cela est géré par Sequelize, le framework ORM utilisé dans l'application.

Paramètres de connexion : Assurez-vous que les paramètres de connexion à la base de données sont corrects. Vous pouvez les définir dans le fichier .env. Veuillez vous assurer que les informations suivantes sont correctes :

env
Copy code
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=notimail_db
Modifiez ces valeurs en fonction de votre configuration.

Migrations : Les migrations sont des scripts qui permettent de mettre à jour la structure de la base de données au fil du temps. Vous pouvez exécuter les migrations avec la commande suivante :

Exemple d'utilisation de Sequelize pour la création de modèles
javascript

```bash

// modelUser.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./connectDB');

const User = sequelize.define('User', {
  // Définissez les colonnes de votre table User ici
  // Par exemple :
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Synchronisez le modèle avec la base de données
User.sync();

```

### bcrypt

Bcrypt est une bibliothèque utilisée dans votre application pour le hachage sécurisé des mots de passe. La sécurité des mots de passe est une composante cruciale de la protection des utilisateurs et de leurs informations. Bcrypt offre une méthode robuste de hachage des mots de passe, résistant aux attaques par force brute.

- **Installation de bcrypt**

Pour intégrer Bcrypt dans votre application, vous devez l'installer à l'aide de la commande suivante :

```bash

npm install bcrypt

```

- **Utilisation de Bcrypt**

Utilisez ensuite bcrypt pour hacher les mots de passe avant de les stocker dans la base de données. Lors de l'authentification, vérifiez les mots de passe hachés pour garantir une sécurité optimale.
Voici un exemple de son utilisation dans le contexte de l'inscription d'un nouvel utilisateur :

```bash

// userController.js

const bcrypt = require('bcrypt');

// ... Autres imports et configurations ...

// Fonction d'inscription d'un nouvel utilisateur
const registerUser = async (req, res) => {
  try {
    // Récupérez le mot de passe à partir de la requête
    const password = req.body.password;

    // Utilisez Bcrypt pour hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Enregistrez le nouvel utilisateur dans la base de données avec le mot de passe haché
    // ... (code d'enregistrement dans la base de données)

    // Envoyez une réponse réussie à l'utilisateur
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l'enregistrement de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
  }
};

// ... Autres fonctions du contrôleur ...

```

Dans cet exemple, Bcrypt est utilisé pour hacher le mot de passe avant de l'enregistrer dans la base de données. Lors de l'authentification, vous utiliserez également Bcrypt pour comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données.

Intégrer Bcrypt dans votre application renforce la sécurité des mots de passe, contribuant ainsi à la protection des informations sensibles de vos utilisateurs.

### JSON Web Tokens (JWT)

JSON Web Tokens (JWT) sont utilisés pour la création sécurisée de tokens d'authentification dans cette application. Les JWT offrent une méthode efficace pour gérer l'authentification des utilisateurs en générant des tokens après la connexion, qui sont ensuite inclus dans les requêtes ultérieures pour prouver l'identité de l'utilisateur.

- **Installation de jsonwebtoken**

Intégrez JWT dans votre application en installant le module jsonwebtoken à l'aide de la commande suivante :

```bash

npm install jsonwebtoken

```

- **Utilisation de JSON Web Tokens**

Une fois installé, utilisez JWT pour générer et vérifier des tokens d'authentification. Voici un exemple basique de création d'un token après une connexion réussie :

```bash
// authenticateUser.js

const jwt = require('jsonwebtoken');

// ... Autres imports et configurations ...

// Fonction d'authentification de l'utilisateur
const authenticateUser = (user) => {
  try {
    // Créez un token avec les informations de l'utilisateur
    const token = jwt.sign({ userId: user.id, username: user.username }, 'votre_clé_secrète', { expiresIn: '1h' });

    // Retournez le token
    return token;
  } catch (error) {
    console.error('Erreur lors de la création du token d\'authentification :', error);
    throw new Error('Erreur lors de la création du token d\'authentification.');
  }
};

// ... Autres fonctions liées à l'authentification ...

```

Dans cet exemple, JWT est utilisé pour créer un token contenant des informations spécifiques de l'utilisateur. La clé secrète (dans cet exemple, 'votre_clé_secrète') est utilisée pour signer le token, assurant son intégrité.

Intégrer JWT dans l'application renforce le processus d'authentification en fournissant une méthode sécurisée pour la gestion des tokens. Cette approche contribue à la sécurité et à la fiabilité du système d'authentification de l'application.

### CORS (Cross-Origin Resource Sharing)

Cross-Origin Resource Sharing (CORS) est une mesure de sécurité essentielle qui contrôle l'accès aux ressources d'un site web depuis un autre domaine. Cette fonctionnalité est cruciale pour protéger votre application contre les requêtes malveillantes en provenance de domaines non autorisés.

- **Installation de cors**

Intégrez la gestion de CORS dans votre application en installant le package cors avec la commande suivante :

```bash

npm install cors

```

CORS (Cross-Origin Resource Sharing)
Cross-Origin Resource Sharing (CORS) est une mesure de sécurité essentielle qui contrôle l'accès aux ressources d'un site web depuis un autre domaine. Cette fonctionnalité est cruciale pour protéger votre application contre les requêtes malveillantes en provenance de domaines non autorisés.

Installation de cors
Intégrez la gestion de CORS dans votre application en installant le package cors avec la commande suivante :

bash
Copy code
npm install cors
Exécutez cette commande dans le répertoire racine de votre projet Node.js.

- **Utilisation de CORS**

Intégrez CORS dans votre application en utilisant le code suivant :

```bash

import express from "express";
import cors from "cors";
const app = express();

app.use(cors())

app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});

```

Dans cet exemple, l'application Express utilise le middleware CORS pour autoriser les requêtes de tous les origines. Vous pouvez ajuster cette configuration en fonction de vos besoins spécifiques, par exemple en spécifiant les origines autorisées.

## Démarrage

Lancez l'application avec la commande :

```bash

npm start

```

L'application sera accessible à l'adresse <http://localhost:3000> (ou un autre port selon votre configuration).
L'application sera accessible à l'adresse <http://localhost:3000> . Cette configuration CORS contribue à renforcer la sécurité de l' application en gérant de manière appropriée les autorisations d'accès aux ressources depuis d'autres domaines.

## Fonctionalitées du site

### Users

- **Identification** : Les clients peuvent s'identifier dans le service en choisissant leur entreprise dans un menu défilant et en entrant un code à 4 chiffres.
- **Consultation de Courrier** : Les clients peuvent consulter si ils ont du courrier en attente.
- **Accusé de Réception** : Les clients peuvent accuser la récupération de leur courrier.

### Admins

- **Gestion des Users** : Les admins peuvent voir la liste des users et leur statut de courrier actuel.
- **Notifications** : Possibilité d'ajouter des users à la liste des notifications à envoyer en un clic.
- **Vue Récapitulative** : Les admins ont accès à une vue récapitulative des notifications à envoyer.
- **Gestion des Utilisateurs** : Capacité d'ajouter, modifier et supprimer des utilisateurs et de passer un user en admin ainsi que de modifier les mots de passes.

### Super Admin

L'application propose une fonctionnalité de création automatique d'un compte super administrateur lors du lancement initial de l'application. Cette opération est réalisée en utilisant la commande await User.sync({ force: true }). Cette approche garantit la création du compte super administrateur une seule fois, lors de l'initialisation de l'application.

Le mot de passe du super administrateur est automatiquement crypté pour renforcer la sécurité de l'application. De plus, le contrôleur est conçu pour la création des comptes utilisateur, avec la possibilité de générer automatiquement (ou non) un mot de passe à 4 chiffres crypté pour chaque utilisateur.

### Envoi d'e-mails

Une des fonctionnalités cruciales de Notimail est la gestion des notifications par e-mail. Cette fonctionnalité est particulièrement utile dans le contexte de la réception de courrier professionnel et de la domiciliation d'entreprises. Voici comment configurer l'envoi d'e-mails dans l application Node.js à l'aide de Nodemailer.

- **Installation de Nodemailer**

installer le module Nodemailer en utilisant la commande suivante :

```bash

npm install nodemailer

```

- **Configuration de Nodemailer**

```bash

// Importation des modules nécessaires
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Fonction pour envoyer un e-mail
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

export { sendEmail };

```

- **Utilisation de Nodemailer**

Le contrôleur d'utilisateurs (userController.js) utilise la fonction sendEmail pour envoyer des notifications par e-mail. Voici un exemple d'utilisation dans le contexte de la création d'un nouvel utilisateur et de la mise à jour de ses informations.

Création d'un nouvel utilisateur

```bash

// Création d'un nouvel utilisateur avec notification par e-mail
const newUser = new User(req.body);
const code = Math.floor(1000 + Math.random() * 9000);
const userCode = code.toString().padStart(4, '0');
const hashedCode = await bcrypt.hash(userCode, saltRounds);
newUser.password = hashedCode;
await newUser.save();

// Envoi d'un e-mail de bienvenue
const mailOptions = {
  from: 'votre_adresse_email@gmail.com',
  to: newUser.email,
  subject: 'Bienvenue chez Notimail',
  text: 'Bonjour, Votre compte utilisateur a été créé avec succès.',
};

await sendEmail(mailOptions);

```

- **Mise à jour des informations d'un utilisateur**

```bash

// Mise à jour des informations d'un utilisateur avec notification par e-mail
const rowsUpdated = await User.update(updatedFields, { where: { firm_name: nomEntreprise } });
const newInfoUserEmail = updatedFields.email;

const mailOptions = {
  from: 'votre_adresse_email@gmail.com',
  to: newInfoUserEmail,
  subject: 'Modification de vos informations personnelles',
  text: 'Bonjour, Votre compte utilisateur a été modifié avec succès.',
};

await sendEmail(mailOptions);


```

### Envoi de SMS avec AllMySms

Notimail offre une fonctionnalité d'envoi de SMS via AllMySms, ajoutant une dimension de notification supplémentaire à votre application. Suivez les étapes ci-dessous pour comprendre l'integration de cette fonctionnalité au projet Notimail.

- **Installation**

Utilisez npm pour installer le package nécessaire pour l'envoi de SMS avec AllMySms :

```bash

npm install allmysms

```

- **Configuration de AllMySms**

Inscription sur AllMySms : Assurez-vous d'avoir un compte sur AllMySms (<https://www.allmysms.com/>).

Obtention des identifiants API :
API :
7ef681bd916d088

Identifiant :
stagiairesimts

Configuration dans l application  Notimail, configuration des identifiants API d'AllMySms dans notre fichier de configuration.

```bash

// allmysmsConfig.js

const allMySmsConfig = {
  apiKey: 'VOTRE_CLE_API',
  apiSecret: 'VOTRE_SECRET_API',
  sender: 'VOTRE_EMETTEUR',
};

export default allMySmsConfig;

```

- **Utilisation**

Dans ce code d'application, on utilise la bibliothèque AllMySms pour envoyer des SMS en fonction de nos besoins spécifiques. Voici un exemple basique d'envoi de SMS :

```bash

// smsService.js

import AllMySms from 'allmysms';
import allMySmsConfig from './allmysmsConfig';

const allMySms = new AllMySms(allMySmsConfig);

/**
 * Fonction pour envoyer un SMS
 * @param {string} phoneNumber - Le numéro de téléphone du destinataire.
 * @param {string} message - Le message à envoyer.
 * @returns {Promise} - La promesse de l'envoi du SMS.
 */
const sendSms = (phoneNumber, message) => {
  return allMySms.sendSms(phoneNumber, message);
};

export { sendSms };

```

Utilise la fonction sendSms dans l application pour envoyer des SMS à nos utilisateurs selon les besoins.

- **API Documentation**

Consultez la documentation officielle d'AllMySms pour plus de détails sur l'utilisation de leur API pour l'envoi de SMS. Vous y trouverez des informations approfondies sur les fonctionnalités disponibles et les paramètres à utiliser : Documentation API AllMySms.

### Documentation API avec Swagger UI

Notimail offre une documentation API complète générée à l'aide de Swagger UI. Cela facilite la compréhension et l'utilisation de l'API Notimail pour la notification de courrier.

- **Installation**

Utilisez npm pour installer les packages nécessaires :

```bash

npm install swagger-jsdoc swagger-ui-express

```

- **Configuration de Swagger**

Dans votre fichier contenant la configuration Swagger ( swaggerConfig.js), importation de swagger-jsdoc et swagger-ui-express, puis configuration des informations de base de NOTIMAIL

```bash

// swaggerConfig.js

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notimail',
      version: '1.0.0',
      description: 'API Notimail pour la notification de courrier',
    },
  },
  apis: ['../routes/userRoutes.js'], // Spécifiez le chemin vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };

```

Utilisation
Dans votre fichier principal serveur.js, utilisez les spécifications Swagger générées et exposez Swagger UI pour accéder à la documentation.

```bash

// app.js

import express from 'express';
import { specs, swaggerUi } from './swaggerConfig.js';

const app = express();

// Utilisez les spécifications Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Votre code d'application Notimail continue ici...

app.listen(3000, () => {
  console.log('Serveur Notimail en cours d\'exécution sur le port 3000');
});

```

Dans vos fichiers de routes, utilisez les commentaires JSDoc pour documenter vos endpoints. Swagger utilisera ces commentaires pour générer automatiquement la documentation.

 ```bash

// userRoutes.js

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Endpoints pour la gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       '200':
 *         description: Succès - renvoie la liste des utilisateurs
 *       '500':
 *         description: Erreur du serveur
 */
router.get('/users', userController.getAllUsers);

```

Lancez l application et accédez à l'interface Swagger UI en visitant <http://localhost:3000/api-docs> dans votre navigateur. Vous trouverez une documentation complète de notre API Notimail, ce qui facilitera l'intégration et l'utilisation de l'API pour les développeurs

- Revoir le READ ME
- Faire ine intro a la doc API
- Mettre le commentaires
- alleger le code dans les Controller
- ajouter les fichier de swagger config
