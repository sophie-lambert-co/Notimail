// authController.js

import jwt from 'jsonwebtoken';
import User from './modelUser.js'; // Importez votre modèle User
import bcrypt from "bcrypt";

const secretKey = 'JWT_SECRET'; 

// Fonction pour générer un token JWT
const generateToken = (userData) => {
  return jwt.sign(userData, secretKey, { expiresIn: '1h' }); // Changez le délai d'expiration selon vos besoins
};

// Fonction de connexion de l'utilisateur
const loginUser =  async(req, res) => {
    const { firm_name, password } = req.body;
  console.log(req.body)
    try {
        // Vérifie si le firm_name existe dans la base de données
        const user = await User.findOne({ where: { firm_name : req.body.firm_name } });
    
        if (!user) {
          return res.status(401).json({ message: 'Firm_name incorrect' });
        }
    
        // Compare le mot de passe envoyé avec celui stocké dans la base de données
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
    
        // Si les identifiants sont valides, générez un token JWT
        const userData = { firm_name: user.firm_name};
        const token = generateToken(userData);
    
        // Stocke le token dans un cookie sécurisé
        res.cookie('token', token, { httpOnly: true, secure: true });
    
        res.json({ message: 'Connexion réussie', token });
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
      }
    };

export default loginUser;
