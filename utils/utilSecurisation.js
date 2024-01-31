/**
 * @file utilSecurisation.js
 * @description Fournit des fonctions pour la sécurité, telles que la vérification de l'existence d'un firm_name, la génération de mots de passe administrateur hachés, la génération de codes utilisateur aléatoires, et le hachage de codes utilisateur.
 */


// Import du modèle User depuis le fichier modelUser.js
import User from '../modeles/modelUser.js';
// Import du module bcrypt pour le hachage du mot de passe
import bcrypt from 'bcrypt'

/**
 * Vérifie si un firm_name existe déjà dans la base de données.
 * @param {string} userFirmName - Le firm_name à vérifier.
 * @returns {Promise<boolean>} - Une promesse résolue avec true si le firm_name existe, sinon false.
 */
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

/**
 * Nombre de tours de salage pour le hachage du mot de passe.
 * @constant {number}
 */
export const saltRounds = 10;

/**
 * Génère un mot de passe administrateur haché.
 * @returns {Promise<string>} - Une promesse résolue avec le mot de passe haché.
 */
export async function generateAdminPassword() {
  const password = 'root'; // Remplacez par le mot de passe souhaité
  const hashedPassword = await bcrypt.hash(password, saltRounds); // Hachage du mot de passe
  return hashedPassword
}

/**
 * Génère un code utilisateur aléatoire.
 * @returns {Promise<string>} - Une promesse résolue avec le code utilisateur généré.
 */
export async function generateUserCode() {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code.toString().padStart(4, "0");
}

/**
 * Hache le code utilisateur.
 * @param {string} userCode - Le code utilisateur à hacher.
 * @returns {Promise<string>} - Une promesse résolue avec le code utilisateur haché.
 */
export async function hashUserCode(userCode) {
  return await bcrypt.hash(userCode, saltRounds);
}
