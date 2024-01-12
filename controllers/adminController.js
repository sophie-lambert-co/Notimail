// adminController.js

import User from '../modeles/modelUser.js'; // Assurez-vous d'importer correctement votre modèle User
import { generateAdminPassword } from '../utils/utils.js';

// Fonction pour la génération du mot de passe administrateur
const createAdminUser = async () => {
  try {
    // Utilise la fonction pour générer le mot de passe administrateur haché
    const hashedPassword = await generateAdminPassword();

    // Crée l'utilisateur avec le mot de passe haché généré
    await User.create({
      first_name: "Clothilde",
      last_name: "Sophie",
      firm_name: "IMTS",
      email: 'MAIL_ADRESS',
      phone_number: "00-00-00-00-00",
      password: hashedPassword,
      is_admin: true,
      has_mail: false
    });

    console.log("Compte administrateur créé avec succès.");
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur :', error);
  }
};

export default createAdminUser;
