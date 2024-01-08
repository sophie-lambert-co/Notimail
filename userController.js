import connection from './connectDB.js';
import  User  from './modelUser.js';
import  verifyFirmName  from './utils.js';



class userController {

  async  createUser(req, res) {
    try {
      console.log(req.body)
      // Crée un nouvel utilisateur avec les données reçues dans la requête
      const newUser = new User(req.body);
      // Sauvegarde le nouvel utilisateur dans la base de données
      await newUser.save();
      // Répond avec le nouvel utilisateur créé en tant que réponse à la requête
      res.status(201).json(newUser); // 201 Created
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }

  async  getAllUser(req, res)  {
    try {
      const [rows] = await connection.query('SELECT * FROM NOTIMAIL.users');
      res.json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
  };
  
  async  getUserByFirmName(req, res) {
    try {
      const { nomEntreprise } = req.params.firm_name;
  
      const isValidFirmName = await verifyFirmName(nomEntreprise);
  
      if (!isValidFirmName) {
        return res.status(400).json({ message: 'Le firm_name n\'existe pas dans la base de données' });
      }
  
      const user = await User.findOne({ where: { firm_name } });
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}

export default userController
//* Fonction asynchrone pour créer un nouvel utilisateur
 
// Récupérer tous les utilisateurs
  
// Autres fonctions de contrôleur pour gérer les utilisateurs...
