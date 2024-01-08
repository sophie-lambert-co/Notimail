// Importations des modules et des fichiers nécessaires pour la gestion des utilisateurs
import connection from './connectDB.js';
import User from './modelUser.js';
import verifyFirmName from './utils.js';

// Classe userController pour gérer les différentes actions liées aux utilisateurs
class userController {
  // Fonction asynchrone pour créer un nouvel utilisateur
  async createUser(req, res) {
    try {
      console.log(req.body);
      // Crée un nouvel utilisateur avec les données reçues dans la requête
      const newUser = new User(req.body);
      // Sauvegarde le nouvel utilisateur dans la base de données
      await newUser.save();
      // Répond avec le nouvel utilisateur créé en tant que réponse à la requête avec le statut 201 (Created)
      res.status(201).json(newUser);
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }

  // Fonction asynchrone pour récupérer tous les utilisateurs
  async getAllUser(req, res) {
    try {
      // Récupère tous les utilisateurs depuis la base de données
      const [rows] = await connection.query('SELECT * FROM NOTIMAIL.users');
      // Répond avec les utilisateurs récupérés
      res.json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
  }

  // Fonction asynchrone pour récupérer un utilisateur par son nom d'entreprise (firm_name)
  async getUserByFirmName(req, res) {
    try {
      // Récupère le nom d'entreprise depuis les paramètres de la requête
      const nomEntreprise = req.params.firm_name;
      console.log(req.params);

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
        return res.status(400).json({ message: 'Le firm_name n\'existe pas dans la base de données' });
      }

      // Récupère l'utilisateur depuis la base de données par son firm_name
      const user = await User.findOne({ where: { firm_name: nomEntreprise } });

      if (!user) {
        // Si l'utilisateur n'est pas trouvé, répond avec un statut 404 et un message d'erreur
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Répond avec les données de l'utilisateur
      res.json(user);
    } catch (error) {
      console.log(error);
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }
}

// Exporte la classe userController pour pouvoir l'utiliser dans d'autres fichiers
export default userController;
