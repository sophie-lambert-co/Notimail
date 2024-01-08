
//Importation du module Router depuis Express pour la création des routes
import { Router } from 'express';


//Importation des fonctions de contrôleur depuis le fichier userController.mjs
import UserController from './userController';
// Création d'une instance du routeur Express
const router = Router();


// Définition des routes pour la gestion des utilisateurs
//Définit plusieurs routes pour différentes actions liées aux utilisateurs, en associant chaque route à une fonction de contrôleur spécifique. Par exemple, la route POST /users est associée à la fonction createUser pour la création d'un utilisateur.


// Route POST pour la création d'un utilisateur
router.post('/user', UserController.createUser);

// Route GET pour récupérer tous les utilisateurs
router.get('/user', UserController.getAllUser);

// Route GET pour récupérer tous les utilisateurs par leurs noms d'entrprises
router.get('/user/:firm_name', UserController.getUserByFirmName);

// Route PUT pour mettre à jour les informations d'un utilisateur
//router.put('/users/:firm_name', updateUser);

// Route DELETE pour supprimer un utilisateur par son identifiant (ID)
//router.delete('/users/:firm_name', deleteUser);

// Exportation du routeur pour pouvoir l'utiliser dans d'autres fichiers
//Exporte le routeur afin qu'il puisse être utilisé dans d'autres fichiers, par exemple, dans le fichier index.mjs où il serait monté sur l'application Express.

export default router;