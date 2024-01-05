# Notimail-Back-CDA



LANCER LE DOCKER

    docker run -d -p 3307:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:latest


CREER LA BASE DE DONNEE

    docker exec -it mysql sh

    mysql -u root -p 
    (entrer le mot de passe root)

    create database NOTIMAIL;