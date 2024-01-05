//Point d'entrée de l'application (app)

// importe le framework Express, utilisé pour la création d'applications web en Node.js.
import express from 'express';
//importe la connexion à la base de données définie dans le fichier connectDB.js.
// La variable connection est utilisée pour interagir avec la base de données via Sequelize.
import { connection } from './connectDB.js';

import { User } from './modelUser.js';

//Importation des routes définies dans le fichier blablaRoutes.mjs
import userRoutes from './userRoute.js';


import morgan from 'morgan';// créent une instance d'Express appelée app et définissent le numéro de port (port) sur lequel le serveur écoutera les connexions entrantes. 

// Création d'une instance d'Express
//  app est une instance du framework Express. Express est un framework web pour Node.js qui simplifie la création d'applications web. Lorsqueje cree une instance d'Express avec const app = express();, app devient le point central pour la configuration du serveur, le routage, etc. Toutes les fonctionnalités d'Express, telles que la définition de routes, l'utilisation de middlewares, etc., sont liées à cette instance.
const app = express();
const port = 3000;

//Express est équipé d'un système de middleware qui permet de traiter les requêtes HTTP
//express.json() : C'est un middleware intégré à Express. Lorsqu'il est utilisé avec app.use(), il permet à l'application Express de comprendre et de traiter les corps des requêtes entrantes au format JSON.
//Lorsqu'un client envoie une requête HTTP avec un corps contenant des données au format JSON (par exemple, dans le cas d'une requête POST ou PUT), ce middleware analyse ce contenu JSON et le transforme en un objet JavaScript, rendant les données disponibles dans req.body pour une utilisation ultérieure dans les routes ou les contrôleurs.
app.use(express.json());

//Middleware Morgan : Morgan est une bibliothèque de middleware pour Express.js utilisée pour la journalisation des requêtes HTTP. Il enregistre les détails des requêtes entrantes sur le serveur.
//'dev' Format : Le paramètre 'dev' est l'un des formats prédéfinis dans Morgan. Ce format présente les logs de manière concise mais informatives, adaptées au développement. Dans ce format, les informations affichées incluent la méthode HTTP, le statut de la réponse, le chemin de l'URL, le temps de réponse et la taille de la réponse.
//app.use() : Cette méthode Express ajoute du middleware à l'application. Lorsqu'elle est utilisée avec app.use(), elle s'applique à chaque requête entrante, enregistrant les détails de la requête HTTP dans les logs conformément au format spécifié.
app.use(morgan('dev'))

//Cette partie crée une route pour l'URL racine ('/') 
app.use('/', userRoutes);



// Utilisation de async/await pour gérer la connexion et le démarrage du serveur
async function startServer() {
  // Essayer d'authentifier la connexion à la base de données
  try {
    await connection.authenticate();
    
    //User : C'est le modèle que vous avez défini à l'aide de Sequelize pour représenter une table de votre base de données. Ce modèle contient les définitions de vos colonnes, types de données, contraintes, etc.
    //sync() : C'est une méthode fournie par Sequelize pour synchroniser le modèle avec la base de données. Elle crée une table correspondant au modèle s'il n'existe pas déjà dans la base de données.
    //{ force: true } : C'est une option utilisée avec la méthode sync(). Lorsque force: true est utilisé, cela signifie que Sequelize va effectuer une opération de force, ce qui entraîne la suppression de toute table existante correspondant au modèle User s'il y en a une, et ensuite recréer la table avec les définitions actuelles du modèle.
    //Ainsi, en utilisant await User.sync({ force: true });, vous demandez à Sequelize de synchroniser le modèle User avec la base de données en recréant la table correspondante dans la base de données. 
    await User.sync({ force: false });
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
