// Importe la bibliothèque JSON Web Token (JWT)
import jwt from 'jsonwebtoken';

// Clé secrète pour la signature et la vérification du token
const secretKey = 'JWT_SECRET';

// Fonction middleware pour l'authentification des utilisateurs
//Définit une fonction middleware nommée authenticateUser qui prend en paramètres req (la requête), res (la réponse) et next (la fonction suivante à appeler).
export default function authenticateUser(req, res, next) {
    // Récupère le token depuis le cookie de la requête  supposant qu'il est stocké dans un cookie appelé token.
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

  

  
