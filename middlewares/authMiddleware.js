/**
 * @file authMiddleware.js
 * @description Fournit un middleware d'authentification des utilisateurs basé sur JSON Web Token (JWT).
 * @module authMiddleware
 */

// Importe la bibliothèque JSON Web Token (JWT)
import jwt from 'jsonwebtoken';

// Clé secrète pour la signature et la vérification du token
const secretKey = 'JWT_SECRET';

/**
 * Middleware d'authentification des utilisateurs.
 * @function
 * @name authenticateUser
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction suivante à appeler.
 * @returns {void}
 * @throws {Object} - Renvoie une erreur si l'authentification échoue.
 */
export default function authenticateUser(req, res, next) {
    // Récupère le token depuis le cookie de la requête, supposant qu'il est stocké dans un cookie appelé token.
    const token = req.cookies.token;

    // Vérifie la présence du token dans la requête
    if (!token) {
        // Renvoie une erreur si aucun token n'est trouvé
        return res.status(401).json({ message: 'Authentification requise' });
    }

    // Vérifie la validité du token
    jwt.verify(token, secretKey, (err, decoded) => {
        // Gère les erreurs de vérification du token
        if (err) {
            // Renvoie une erreur si le token est invalide
            return res.status(401).json({ message: 'Token invalide' });
        }

        // Stocke les informations de l'utilisateur dans l'objet de requête
        req.user = decoded;

        // Passe au middleware ou à la fonction de routage suivante
        next();
    });
};
