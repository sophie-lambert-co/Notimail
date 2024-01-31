/**
 * @file adminController.js
 * @description Contrôleur pour la gestion des opérations liées à l'administrateur.
 * @module adminController
 */

import User from '../modeles/modelUser.js'; // Assurez-vous d'importer correctement votre modèle User
import { generateAdminPassword } from '../utils/utilSecurisation.js';

/**
 * Fonction asynchrone pour la création d'un utilisateur administrateur.
 * @async
 * @function
 * @name createAdminUser
 * @returns {void}
 */
const createAdminUser = async () => {
  try {
    // Utilise la fonction pour générer le mot de passe administrateur haché
    const hashedPassword = await generateAdminPassword();

    // Crée l'utilisateur avec le mot de passe haché généré
    await User.create({
      first_name: "Clothilde",
      last_name: "Sophie",
      firm_name: "IMTS",
      email: 'MAIL_ADRESS', // Assurez-vous de remplacer 'MAIL_ADRESS' par une véritable adresse e-mail
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
