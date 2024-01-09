// Importe le module Sequelize pour utiliser ses fonctionnalités dans ce fichier.
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

// Crée une nouvelle instance Sequelize nommée "connection".
// Cette instance est configurée pour se connecter à la base de données MySQL.
// Les informations de connexion sont récupérées à partir des variables d'environnement.
const connection = new Sequelize(
  process.env.DB_NAME, // Nom de la base de données
  process.env.DB_USER, // Utilisateur de la base de données
  process.env.DB_PASS, // Mot de passe de la base de données
  {
    host: process.env.DB_HOST, // Adresse de l'hôte de la base de données
    port: process.env.DB_PORT, // Port de la base de données
    dialect: "mysql", // Spécifie l'utilisation de MySQL comme dialecte de base de données
  }
);

// Exporte l'instance "connection".
// Cela permet à d'autres modules/fichiers d'importer cette connexion et d'interagir avec la base de données
// en utilisant cette même instance Sequelize.
export default connection;
