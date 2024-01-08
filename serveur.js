import express from 'express';
import connection  from './connectDB.js';
import  getAllUsers  from './userController.js';
import userRouter from './userRoutes.js';
import morgan from 'morgan';
const app = express();
const port = 3000;

app.use(morgan("dev"))
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/', userRouter);

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

