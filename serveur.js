import  express  from "express";
import connectDB from './connectDB.js';
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const startServer = async () => {
    try {
      // Connexion à la base de données
      await connectDB();
      console.log('Connecté à NOTIMAIL');
  
      // Démarrage du serveur Express une fois la connexion établie
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
    } catch (error) {
      console.error('Erreur lors du démarrage du serveur :', error);
      process.exit(1);
    }
  };
  
  startServer();