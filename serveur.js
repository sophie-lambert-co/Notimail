//Fichier qui configure le serveur ( donc l'application coté back)

// Importe Express et initialise une application
import express from "express";
import database from "./database.js"; // Importe la connexion à la base de données depuis connectDB.js
import userRouter from "./routes/userRoutes.js"; // Importe le routeur pour la gestion des utilisateurs depuis userRoutes.js
import morgan from "morgan"; // Importe le middleware Morgan pour les logs de requêtes HTTP
import User from "./modeles/modelUser.js";
import cors from "cors";
import router from './routes/userRoutes.js';
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

export const app = express(); // Initialise une application Express

// Route pour la documentation Swagger
const options = {
  definition: {
    
    openapi: '3.0.0',
    info: {
      title: 'Notimail',
      version: '1.0.0',
      description: 'API Notimail pour la notification de courrier',
    },
  },
  apis: ['./routes/userRoutes.js', './modeles/modelUser.js'],

};


const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// Utilisation du middleware Morgan pour les logs de développement
app.use(morgan("dev"));

// Utilisation d'express.json() pour analyser les corps des requêtes au format JSON
app.use(express.json());

// Utilise ton routeur
app.use('/api', router);

// Route pour la racine de l'API, renvoie simplement un message "Hello World!"
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Utilisation du routeur userRouter pour les chemins relatifs à la gestion des utilisateurs
app.use("/", userRouter);

app.use(cors());

// Fonction asynchrone pour démarrer le serveur
export const connectDB = async () => {
  try {
    // Vérifie la connexion à la base de données en utilisant la méthode authenticate()
    await database.authenticate();

    // Synchronise le modèle User avec la base de données
    await User.sync({ force: false });

  } catch (error) {
    // En cas d'erreur lors du démarrage du serveur, affiche l'erreur et termine le processus avec le code 1
   // console.error("Erreur lors du démarrage du serveur :", error);
    process.exit(1);
  }
};










