import express from 'express';
import connection  from './connectDB.js';
import  getAllUsers  from './userController.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/users', getAllUsers);

const startServer = async () => {
  try {
    await connection.authenticate();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur :', error);
    process.exit(1);
  }
};

startServer();

