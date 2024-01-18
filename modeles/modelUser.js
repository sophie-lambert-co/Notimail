// Importation des modules nécessaires pour la création du modèle
import { Sequelize, DataTypes } from 'sequelize';
import connection from '../database.js'; // Importe la connexion à la base de données

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firm_name:
 *           type: string
 *           description: Le nom de l'entreprise (clé primaire).
 *           example: "NomEntreprise"
 *         first_name:
 *           type: string
 *           description: Le prénom de l'utilisateur.
 *           example: "John"
 *         last_name:
 *           type: string
 *           description: Le nom de famille de l'utilisateur.
 *           example: "Doe"
 *         email:
 *           type: string
 *           description: L'adresse e-mail de l'utilisateur.
 *           example: "john.doe@example.com"
 *         phone_number:
 *           type: string
 *           description: Le numéro de téléphone de l'utilisateur.
 *           example: "1234567890"
 *         password:
 *           type: string
 *           description: Le mot de passe de l'utilisateur.
 *           example: "MotDePasse123"
 *         last_received_mail:
 *           type: string
 *           description: La date du dernier courrier reçu par l'utilisateur.
 *           example: "2024-01-15T12:00:00Z"
 *         last_picked_up:
 *           type: string
 *           description: La date et l'heure du dernier courrier récupéré par l'utilisateur.
 *           example: "2024-01-15T12:00:00Z"
 *         has_mail:
 *           type: boolean
 *           description: Indique si l'utilisateur a du courrier.
 *           example: true
 *         is_admin:
 *           type: boolean
 *           description: Indique si l'utilisateur est un administrateur.
 *           example: false
 */


// Définition du modèle User en utilisant Sequelize
const User = connection.define('users', {
  // Définition des attributs du modèle User avec leurs types et propriétés
  firm_name: {
    type: DataTypes.STRING(45), // Type de données : chaîne de caractères d'une longueur maximale de 25 caractères
    allowNull: false, // La valeur ne peut pas être nulle
    primaryKey: true // Clé primaire de la table
  },
  first_name: {
    type: DataTypes.STRING(25)
  },
  last_name: {
    type: DataTypes.STRING(25)
  },
  email: {
    type: DataTypes.STRING(50), // Type de données : chaîne de caractères d'une longueur maximale de 50 caractères
    allowNull: false // La valeur ne peut pas être nulle
  },
  phone_number: {
    type: DataTypes.STRING(25), // Type de données : chaîne de caractères d'une longueur maximale de 25 caractères
    allowNull: false // La valeur ne peut pas être nulle
  },
  password: {
    type: DataTypes.STRING(400)
  },
  last_received_mail: {
    type: DataTypes.DATE // Type de données : date
  },
  last_picked_up: {
    type: DataTypes.DATE, // Type de données : date
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Valeur par défaut : la date et l'heure actuelles
    allowNull: false // La valeur ne peut pas être nulle
  },
  has_mail: {
    type: DataTypes.BOOLEAN, // Type de données : booléen
    defaultValue: false // Valeur par défaut : false
  },
  is_admin: {
    type: DataTypes.BOOLEAN, // Type de données : booléen
    defaultValue: false // Valeur par défaut : false
  }
}, {
  tableName: 'users', // Nom de la table dans la base de données
  timestamps: true // Si true, ajoute des colonnes "createdAt" et "updatedAt" pour suivre les horodatages de création et de mise à jour
});

export default User; // Exporte le modèle User pour pouvoir l'utiliser dans d'autres fichiers
