import jwt from 'jsonwebtoken';

const secretKey = 'JWT_SECRET';

export default function authenticateUser(req, res , next) {

    const token = req.cookies.token; // Récupère le token depuis le cookie

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
      }
    
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Token invalide' });
        }
        
        // Stocke les informations de l'utilisateur dans l'objet de requête pour une utilisation ultérieure
        req.user = decoded;
        next();
      });
    };
  

  
