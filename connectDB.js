// Connection a la base de données

//importe le module Sequelize. Elle permet d'utiliser les fonctionnalités de Sequelize dans le fichier actuel.
import { Sequelize } from 'sequelize';

//crée une nouvelle instance Sequelize appelée sequelize.
// L'instance est configurée pour se connecter à la base de données MySQL appelée 'NOTIMAIL' en utilisant l'utilisateur 'root' et le mot de passe 'root'.
// il spécifie l'hôte ('localhost') et le port ('55004') sur lequel le serveur MySQL est en cours d'exécution. 
//La propriété dialect est définie sur 'mysql' pour indiquer que Sequelize doit utiliser MySQL comme dialecte de base de données.
    const sequelize = new Sequelize('NOTIMAIL', 'root', 'root', {
      host: 'localhost',
      port: 55004, // Port MySQL
      dialect: 'mysql',
    });

    // exporte l'instance Sequelize (sequelize) en tant que constante nommée connection.
    // Cela permet à d'autres fichiers/modules d'importer cette connexion et d'interagir avec la base de données en utilisant cette instance Sequelize.
    export const connection =  sequelize;
