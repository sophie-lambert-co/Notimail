// Importe le module Sequelize pour utiliser ses fonctionnalités dans ce fichier.
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const dbHost = process.env.DB_HOST ;
const dbUser = process.env.DB_USER ;
const dbPassword = process.env.DB_PASSWORD ;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;

// Crée une nouvelle instance Sequelize nommée "connection".
// Cette instance est configurée pour se connecter à la base de données MySQL appelée 'NOTIMAIL',
// en utilisant l'utilisateur 'root' et le mot de passe 'root'.
// L'instance est paramétrée avec l'hôte ('localhost') et le port ('55004') du serveur MySQL.
// La propriété "dialect" est définie sur 'mysql' pour spécifier l'utilisation de MySQL comme dialecte de base de données.
const connection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort, // Port utilisé pour se connecter au serveur MySQL
  dialect: 'mysql',
});

// Exporte l'instance "connection".
// Cela permet à d'autres modules/fichiers d'importer cette connexion et d'interagir avec la base de données
// en utilisant cette même instance Sequelize.
export default connection;


