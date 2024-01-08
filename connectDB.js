// Connexion à la base de données MySQL avec Sequelize

// Importe le module Sequelize pour utiliser ses fonctionnalités dans ce fichier.
import { Sequelize } from 'sequelize';

// Crée une nouvelle instance Sequelize nommée "connection".
// Cette instance est configurée pour se connecter à la base de données MySQL appelée 'NOTIMAIL',
// en utilisant l'utilisateur 'root' et le mot de passe 'root'.
// L'instance est paramétrée avec l'hôte ('localhost') et le port ('55004') du serveur MySQL.
// La propriété "dialect" est définie sur 'mysql' pour spécifier l'utilisation de MySQL comme dialecte de base de données.
const connection = new Sequelize('NOTIMAIL', 'root', 'root', {
  host: 'localhost',
  port: 3307, // Port utilisé pour se connecter au serveur MySQL
  dialect: 'mysql',
});

// Exporte l'instance "connection".
// Cela permet à d'autres modules/fichiers d'importer cette connexion et d'interagir avec la base de données
// en utilisant cette même instance Sequelize.
export default connection;

