// fichier qui se connect puis demarre le serveur express

import { app, connectDB } from "./serveur.js";
import dotenv from "dotenv";
import createAdminUser from './controllers/adminController.js'; // Utils une seule fois au lancement de l'application pour la creation du SUPER Admin

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

// Définit le port sur lequel le serveur va écouter les connexions entrantes
const port = process.env.SERVER_PORT;


app.listen(port, function () {
    // Lance le serveur Express pour écouter les connexions entrantes sur le port spécifié

    // Ajout du compte administrateur
   // createAdminUser();
    connectDB();
  });