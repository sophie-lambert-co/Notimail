
// Un token, dans le contexte de la sécurité informatique et des systèmes d'authentification, est une chaîne de caractères ou un jeton qui est utilisé pour représenter l'autorisation ou l'identification dans une application ou un système.
//Le terme "token" peut être traduit en français par "jeton". En informatique, ce terme est souvent utilisé pour désigner une pièce d'identité numérique ou une clé, qui est utilisée pour représenter l'autorisation d'accéder à une ressource ou de réaliser une action dans un système.
// Il existe plusieurs types de tokens, dont les plus courants sont :
//Token d'authentification (Access Token) : Il est utilisé pour prouver l'identité de l'utilisateur connecté. Ces tokens sont souvent émis après une authentification réussie (par exemple, connexion avec un nom d'utilisateur et un mot de passe) et sont utilisés pour accéder à des ressources protégées sur un serveur.
//Token de rafraîchissement (Refresh Token) : Dans certains systèmes d'authentification, un token de rafraîchissement est utilisé pour obtenir un nouveau token d'authentification après expiration ou révocation de l'access token. Il est souvent utilisé dans les flux OAuth2 pour obtenir de nouveaux access tokens sans que l'utilisateur doive se reconnecter.
//Token CSRF (Cross-Site Request Forgery) : Ce token est utilisé pour protéger contre les attaques CSRF en ajoutant un jeton unique à chaque requête, ce qui permet de vérifier si la requête provient d'une source légitime.
//Les tokens sont généralement encodés et signés à l'aide de techniques cryptographiques telles que JWT (JSON Web Tokens) ou d'autres méthodes similaires, garantissant ainsi leur intégrité et leur sécurité.
//Ces tokens sont souvent échangés entre le client (tel qu'un navigateur ou une application mobile) et le serveur pour permettre l'authentification et l'autorisation des utilisateurs.

// Importe le module JSON Web Token (JWT) pour la gestion des tokens d'authentification
import jwt from 'jsonwebtoken';
// Importe le modèle User depuis le fichier modelUser.js pour interagir avec la base de données des utilisateurs
import User from '../modeles/modelUser.js';
// Importe le module bcrypt pour le hachage et la comparaison des mots de passe
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env



// La clé secrète utilisée pour sécuriser et signer le token JWT
const secretKey = process.env.JWT_SECRET; 

// Fonction pour générer un token JWT
const generateToken = (userData) => {
    //userData est défini spécifiquement avec le nom de l'entreprise (firm_name: user.firm_name). Lorsque le processus de connexion réussit, cet objet userData est utilisé pour générer un token JWT contenant les données de l'utilisateur.
  // La méthode 'sign' du module jwt prend les données de l'utilisateur (payload),
  // la clé secrète pour signer le token, et des options (telles que expiresIn)
  // pour générer un token JWT sécurisé
  return jwt.sign(userData, secretKey, { expiresIn: '1h' });
};


// Fonction de connexion de l'utilisateur
const loginUser = async (req, res) => {
  // Extraction des données firm_name et password depuis le corps de la requête HTTP
  const { firm_name, password } = req.body;
  
  // Affichage dans la console des données reçues pour déboguer ou vérifier les informations
  console.log(req.body);

  try {
    // Vérifie si le firm_name envoyé correspond à un utilisateur dans la base de données
    const user = await User.findOne({ where: { firm_name: req.body.firm_name } });

    // Si aucun utilisateur correspondant n'est trouvé, retourne une erreur 401 (Non autorisé)
    // avec un message indiquant que le firm_name est incorrect
    if (!user) {
      return res.status(401).json({ message: 'Firm_name incorrect' });
    }

    // Compare le mot de passe envoyé avec celui stocké dans la base de données
    // en utilisant la fonction compare() du module bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Si les mots de passe ne correspondent pas, retourne une erreur 401
    // avec un message indiquant que le mot de passe est incorrect
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Si les identifiants sont valides, génère un token JWT avec les données de l'utilisateur
    const userData = { firm_name: user.firm_name }; // Les données à inclure dans le token l est à noter que , userData est utilisé pour stocker uniquement le nom de l'entreprise (firm_name) comme information supplémentaire. Cependant, dans des applications réelles, cet objet peut contenir une gamme plus large d'informations utilisateur nécessaires pour les besoins d'authentification, d'autorisation ou d'autres fonctionnalités spécifiques de l'application.
    const token = generateToken(userData); // Appel de la fonction pour générer le token JWT

    // Stocke le token dans un cookie sécurisé (httpOnly et secure)
    // pour une utilisation ultérieure lors des requêtes à l'API
    res.cookie('token', token, { httpOnly: true, secure: false });

    // Répond à la requête avec un statut 200 (OK) et un message de succès
    // contenant le token JWT généré pour l'utilisateur
    res.json({ message: 'Connexion réussie', user: user });
  } catch (error) {
    // En cas d'erreur lors du processus d'authentification, capture et gère l'erreur
    // Affiche l'erreur dans la console à des fins de débogage ou de suivi
    console.log(error);

    // Répond à la requête avec un statut 500 (Erreur interne du serveur) et un message d'erreur
    res.status(500).json({ error: error.message });
  }
};

export default loginUser; // Exporte la fonction de connexion de l'utilisateur pour une utilisation externe

