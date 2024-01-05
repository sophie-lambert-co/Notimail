//Point d'entrée de l'application (app)

// importe le framework Express, utilisé pour la création d'applications web en Node.js.
import express from 'express';
//importe la connexion à la base de données définie dans le fichier connectDB.js.
// La variable connection est utilisée pour interagir avec la base de données via Sequelize.
import { connection } from './connectDB.js';
import { getAllUsers } from './userController.js';


// créent une instance d'Express appelée app et définissent le numéro de port (port) sur lequel le serveur écoutera les connexions entrantes. 
const app = express();
const port = 3000;

//Cette partie crée une route pour l'URL racine ('/') en utilisant la méthode HTTP GET.
// Lorsqu'un utilisateur accède à cette route, le serveur renvoie la chaîne de caractères 'Hello World!' comme réponse.
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Utilisation de async/await pour gérer la connexion et le démarrage du serveur
async function startServer() {
  // Essayer d'authentifier la connexion à la base de données
  try {
    await connection.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    // Démarrer le serveur Express pour écouter les connexions entrantes
    app.listen(port, () => {
      // Capturer et gérer les erreurs de connexion à la base de données
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    // Arrêter le processus en cas d'erreur de connexion
    process.exit(1); 
  }
}

// Appel de la fonction startServer pour démarrer le serveur Expressgit branch --all 
startServer();
