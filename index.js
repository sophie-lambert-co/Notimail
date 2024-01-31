/**
 * Fichier qui se connecte puis démarre le serveur Express.
 * @module startServer
 */

import { app, connectDB } from "./serveur.js"; // Importe l'application Express et la fonction de connexion à la base de données
import dotenv from "dotenv"; // Importe le module dotenv pour charger les variables d'environnement depuis le fichier .env
import createAdminUser from './controllers/adminController.js'; // Importe la fonction de création du compte administrateur (utilisée une seule fois au lancement)

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

// Définit le port sur lequel le serveur va écouter les connexions entrantes
const port = process.env.SERVER_PORT;

/**
 * Lance le serveur Express pour écouter les connexions entrantes sur le port spécifié.
 * Ajoute le compte administrateur et connecte la base de données.
 * @function
 * @param {number} port - Le numéro de port sur lequel le serveur doit écouter.
 */
app.listen(port, function () {
    // Ajout du compte administrateur (décommenter si nécessaire)
    // createAdminUser();
    // Connexion à la base de données
    connectDB();
});
