// Importation du module Router depuis Express pour la création des routes
import { Router } from 'express';

// Importation du contrôleur d'utilisateurs depuis le fichier userController.js
import userController from './userController.js';
import authenticateUser from './authMiddleware.js';
import loginUser from './authController.js';
import sendNotificationController from './notificationController.js';

// Création d'une instance du routeur Express
const router = Router();

// Création d'une instance du contrôleur UserController
const UserController = new userController();
const SendNotificationController = new sendNotificationController();

// Définition des routes pour la gestion des utilisateurs
// Chaque route est associée à une fonction spécifique du contrôleur

// Route pour la connexion de l'utilisateur
router.post('/login', loginUser);

// Route POST pour la création d'un utilisateur
router.post('/user', UserController.createUser);

// Route GET pour récupérer tous les utilisateurs
router.get('/user', UserController.getAllUser);

// Route GET pour récupérer tous les utilisateurs par leurs noms d'entreprises
router.get('/user/:firm_name', UserController.getUserByFirmName);

// Route PUT pour mettre à jour un utilisateur par son firm_name
router.put('/user/:firm_name', UserController.updateUser);

// Route pour l'envoi des notifications
router.post('/send', SendNotificationController.sendNotification);

// Route DELETE pour supprimer un utilisateur par son firm_name
router.delete('/user/:firm_name', UserController.deleteUser);



// Exportation du routeur pour l'utiliser dans d'autres fichiers
// Cela permet au fichier index.js ou tout autre fichier de monter ce routeur sur l'application Express
export default router;
