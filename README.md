# Notimail-Back-CDA

LANCER LE DOCKER

    docker run -d -p 3307:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:latest

CREER LA BASE DE DONNEE

    docker exec -it mysql sh

    mysql -u root -p 
    (entrer le mot de passe root)

    create database NOTIMAIL;

## Environnement de l'applicaation NOITMAIL

- docker
- nodeJS
- express
- Sequalize
- morgan

## Creation de fihciers

- connectDB  (creation d'un instance sequalize)
- serveur ( app, point d'entrée de l'application )
- modelUser ( creation du model et de la table users , grace à :  await User.sync({ force: true });)
- userController (fichier qui va gerer toutes les fonctions du CRUD)
- userRoute ( creation des routes pour les fonctions du CRUD de la table users)

## Securisation d'un site

hashage Bcrype
JWT
.env dotenv

1. dotenv :
dotenv est utilisé pour charger les variables d'environnement à partir d'un fichier .env.

Installation : Commencez par installer le package dotenv via npm :

Copy code
npm install dotenv
Utilisation : Créez un fichier .env à la racine de votre projet et définissez-y vos variables d'environnement :

plaintext
Copy code
DB_HOST=localhost
DB_USER=user
DB_PASS=password
PORT=3000
JWT_SECRET=mysecretkey
Chargement dans le code : Au début de votre application (typiquement dans votre fichier principal comme serveur.js), ajoutez la ligne suivante pour charger les variables d'environnement :

javascript
Copy code
require('dotenv').config();
Ceci rendra les variables d'environnement définies dans le fichier .env accessibles via process.env.

2. Bcrypt :
Bcrypt est utilisé pour le hachage sécurisé des mots de passe.

Installation : Installez le package bcrypt via npm :

Copy code
npm install bcrypt
Utilisation : Vous pouvez l'utiliser pour hacher les mots de passe avant de les stocker dans la base de données et pour vérifier les mots de passe hachés lors de l'authentification.

3. JWT (JSON Web Tokens) :
JWT est utilisé pour créer des tokens d'authentification.

Installation : Installez le package jsonwebtoken via npm :
npm install jsonwebtoken

- Utilisation : JWT est utile pour générer des tokens lors de l'authentification réussie et pour vérifier l'authenticité de ces tokens lorsqu'ils sont reçus dans les requêtes ultérieures.
