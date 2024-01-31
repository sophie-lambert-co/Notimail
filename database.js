/**
 * Module de configuration Sequelize pour interagir avec une base de données MySQL.
 * @module sequelizeConfig
 * @exports {Sequelize} database - Instance Sequelize configurée pour la base de données.
 */

// Importe le module Sequelize pour utiliser ses fonctionnalités dans ce fichier.
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

// Récupère les informations de connexion à la base de données depuis les variables d'environnement
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;

/**
 * Instance Sequelize configurée pour interagir avec la base de données MySQL.
 * @const {Sequelize} database
 * @public
 */
const database = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort, // Port utilisé pour se connecter au serveur MySQL
  dialect: 'mysql',
});

// Exporte l'instance "database".
// Cela permet à d'autres modules/fichiers d'importer la BDD et d'interagir avec la base de données
// en utilisant cette même instance Sequelize.
export default database;
