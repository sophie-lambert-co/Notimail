// Importe Express et initialise une application
import express from 'express';
const app = express();

// Importe la connexion à la base de données depuis connectDB.js
import connection from './connectDB.js';

// Importe le routeur pour la gestion des utilisateurs depuis userRoutes.js
import userRouter from './userRoutes.js';

// Importe le middleware Morgan pour les logs de requêtes HTTP
import morgan from 'morgan';
import User from './modelUser.js';

// Définit le port sur lequel le serveur va écouter les connexions entrantes
const port = 3000;

// Utilisation du middleware Morgan pour les logs de développement
app.use(morgan('dev'));

// Utilisation d'express.json() pour analyser les corps des requêtes au format JSON
app.use(express.json());

// Route pour la racine de l'API, renvoie simplement un message "Hello World!"
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Utilisation du routeur userRouter pour les chemins relatifs à la gestion des utilisateurs
app.use('/', userRouter);

// Fonction asynchrone pour démarrer le serveur
const startServer = async () => {
  try {
    // Vérifie la connexion à la base de données en utilisant la méthode authenticate()
    await connection.authenticate();
    await User.sync({ force: false });

    // Lance le serveur Express pour écouter les connexions entrantes sur le port spécifié
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    // En cas d'erreur lors du démarrage du serveur, affiche l'erreur et termine le processus avec le code 1
    console.error('Erreur lors du démarrage du serveur :', error);
    process.exit(1);
  }
};

// Appel de la fonction startServer pour démarrer le serveur
startServer();
