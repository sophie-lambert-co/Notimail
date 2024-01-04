import express from "express";
import sequelize from "./connectDB.js";
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {

  sequelize.authenticate()
    .then(() => {
      console.log('Connexion à la base de données établie avec succès.');
    })
    .catch(err => {
      console.error('Erreur de connexion à la base de données:', err);
    });

  console.log(`Example app listening on port ${port}`)
})
