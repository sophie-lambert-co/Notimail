// adminController.js

import User from './modelUser.js'; // Assurez-vous d'importer correctement votre modèle User
import { generateAdminPassword } from './utils.js';

// Fonction pour la génération du mot de passe administrateur
const createAdminUser = async (req, res) => {
  try {
    // Utilise la fonction pour générer le mot de passe administrateur haché
    const hashedPassword = await generateAdminPassword();

    // Crée l'utilisateur avec le mot de passe haché généré
    await User.create({
      first_name: "Clothilde",
      last_name: "Sophie",
      firm_name: "IMTS",
      email: "sophie.lambert@institutsolacroup.com",
      phone_number: "00-00-00-00-00",
      password: hashedPassword,
      is_admin: true,
      has_mail: false
    });

    res.status(201).json({ message: 'Compte administrateur créé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur :', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte administrateur.' });
  }
};

export default createAdminUser;
