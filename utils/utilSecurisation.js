// Import du modèle User depuis le fichier modelUser.js
import User from '../modeles/modelUser.js';
// Import du module bcrypt pour le hachage du mot de passe
import bcrypt from 'bcrypt'

// Fonction asynchrone qui vérifie si un firm_name existe déjà dans la base de données
export async function verifyFirmName(userFirmName) {
  try {
    console.log(userFirmName); // Affichage du firm_name reçu en paramètre

    // Recherche d'un utilisateur existant avec le firm_name spécifié
    const existingUser = await User.findOne({ where: { firm_name: userFirmName } });

    // Si aucun utilisateur avec le firm_name n'est trouvé, retourner false
    if (!existingUser) {
      return false;
    }

    // Si un utilisateur avec le firm_name est trouvé, retourner true
    return true;
  } catch (error) {
    // En cas d'erreur, affichez un message d'erreur et lancez une nouvelle erreur
    console.error('Erreur lors de la vérification du firm_name :', error);
    throw new Error('Erreur lors de la vérification du firm_name');
  }
}

//############################

// mot de passe Admin

// Définition du nombre de tours de salage pour le hachage
export const saltRounds = 10;

/// Fonction asynchrone pour générer un mot de passe administrateur haché
export async function generateAdminPassword() {
  const password = 'root'; // Remplacez par le mot de passe souhaité
  const hashedPassword = await bcrypt.hash(password, saltRounds); // Hachage du mot de passe
  return hashedPassword
}


//####################################

// Fonction pour générer un code utilisateur aléatoire
export async function generateUserCode() {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code.toString().padStart(4, "0");
}

//######################################

// Fonction pour hacher le code utilisateur
export async function hashUserCode(userCode) {
  return await bcrypt.hash(userCode, saltRounds);
}






