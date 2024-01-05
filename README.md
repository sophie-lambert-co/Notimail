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
