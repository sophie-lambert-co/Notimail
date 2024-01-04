import { connection } from './connectDB.js';

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
};

// Autres fonctions de contrôleur pour gérer les utilisateurs...
