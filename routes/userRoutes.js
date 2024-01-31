/**
 * @file userRoutes.js
 * @description Fournit des routes pour la gestion des utilisateurs.
 * @module userRoutes
 */


// Importation du module Router depuis Express pour la création des routes
import { Router } from 'express';

// Importation du contrôleur d'utilisateurs depuis le fichier userController.js
import userController from '../controllers/userController.js';
import loginUser from '../controllers/authController.js';
import createAdminUser  from '../controllers/adminController.js';
import authenticateUser from '../middlewares/authMiddleware.js';




// Création d'une instance du routeur Express
const router = Router();

// Création d'une instance du contrôleur UserController
const UserController = new userController();

// Définition des routes pour la gestion des utilisateurs
// Chaque route est associée à une fonction spécifique du contrôleur

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Création Super Admin au lancement de l'application .
 *     description: Endpoint pour la création du Super Admin.
 *     tags:
 *       - Création
 *     requestBody:
 *       description: Les informations de création du Super Admin.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firm_name:
 *                 type: string
 *                 description: Le nom de l'entreprise (clé primaire).
 *                 example: "NomEntreprise"
 *               first_name:
 *                 type: string
 *                 description: Le prénom de l'utilisateur.
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: Le nom de famille de l'utilisateur.
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: L'adresse e-mail de l'utilisateur.
 *                 example: "john.doe@example.com"
 *               phone_number:
 *                 type: string
 *                 description: Le numéro de téléphone de l'utilisateur.
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: "MotDePasse123"
 *     responses:
 *       200:
 *         description: Super Admin créé avec succès. Retourne les informations de l'utilisateur et un jeton d'accès.
 *       401:
 *         description: Échec de la création de Super Admin en raison d'informations d'identification incorrectes ou d'absence d'utilisateur.
 */

// Route pour la creation d'un admin
router.post('/admin',authenticateUser, createAdminUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Endpoint pour la connexion d'un utilisateur.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       description: Les informations d'identification de l'utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firm_name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie. Retourne les informations de l'utilisateur et un jeton d'accès.
 *       401:
 *         description: Échec de la connexion en raison d'informations d'identification incorrectes ou d'absence d'utilisateur.
 */

// Route POST pour la connexion d'un utilisateur
router.post('/login', loginUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Endpoint pour créer un nouvel utilisateur.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       description: Les informations de création d'un utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur lors de la création de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la création de l'utilisateur"
 */

// Route POST pour la création d'un utilisateur
router.post('/user',authenticateUser, UserController.createUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Récupération de tous les utilisateurs
 *     description: Endpoint pour récupérer la liste de tous les utilisateurs.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Échec de la récupération des utilisateurs en raison d'une erreur interne.
 */


// Route GET pour récupérer tous les utilisateurs
router.get('/user',authenticateUser, UserController.getAllUser);

/**
 * @swagger
 * /user/:firm_name:
 *   get:
 *     summary: Récupérer un utilisateur par son nom d'entreprise
 *     description: Endpoint pour récupérer un utilisateur à partir de son nom d'entreprise (firm_name).
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: firm_name
 *         required: true
 *         description: Le nom d'entreprise de l'utilisateur.
 *         schema:
 *           type: string
 *           example: "NomEntreprise"
 *     responses:
 *       200:
 *         description: Succès de la récupération de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Le nom d'entreprise n'existe pas dans la base de données.
 *         content:
 *           application/json:
 *             example:
 *               message: "Le firm_name n'existe pas dans la base de données"
 *       404:
 *         description: Utilisateur non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur lors de la récupération de l'utilisateur.
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur lors de la récupération de l'utilisateur"
 */


// Route GET pour récupérer tous les utilisateurs par leurs noms d'entreprises
router.get('/user/:firm_name',authenticateUser, UserController.getUserByFirmName);


/**
 * @swagger
 * /user/:firm_name:
 *   put:
 *     summary: Mettre à jour un utilisateur par son nom d'entreprise
 *     description: Endpoint pour mettre à jour un utilisateur à partir de son nom d'entreprise (firm_name).
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: firm_name
 *         required: true
 *         description: Le nom d'entreprise de l'utilisateur à mettre à jour.
 *         schema:
 *           type: string
 *           example: "NomEntreprise"
 *     requestBody:
 *       description: Les champs à mettre à jour pour l'utilisateur.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mise à jour réussie. Retourne les données de l'utilisateur mises à jour.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mise à jour réussie."
 *                 updatedUser:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Le nom d'entreprise n'existe pas dans la base de données.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Le firm_name n'existe pas dans la base de données"
 *       404:
 *         description: Utilisateur non trouvé.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur lors de la mise à jour de l'utilisateur.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Erreur lors de la mise à jour de l'utilisateur"
 */


// Route PUT pour mettre à jour un utilisateur par son firm_name
router.put('/user/:firm_name',authenticateUser, UserController.updateUser);

/**
 * @swagger
 * /send:
 *   put:
 *     summary: Envoyer des notifications aux utilisateurs
 *     description: Endpoint pour envoyer des notifications à plusieurs utilisateurs en mettant à jour leurs états de notification et en envoyant des e-mails.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       description: Liste des notifications à envoyer.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listNotif:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firm_name:
 *                       type: string
 *                       example: "NomEntreprise"
 *     responses:
 *       200:
 *         description: Utilisateurs modifiés avec succès et envoi de mail réussi.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Utilisateurs modifiés avec succès et envoi de mail ok"
 *       400:
 *         description: Le format de la notification est incorrect.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Le format de la notification est incorrect."
 *       500:
 *         description: Erreur lors de la mise à jour des utilisateurs et de l'envoi du mail.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Erreur lors de la mise à jour des utilisateurs et de l'envoi du mail."
 */


// Route pour l'envoi des notifications
router.put('/send',authenticateUser, UserController.sendNotification);


/**
 * @swagger
 * /user/:firm_name :
 *   delete:
 *     summary: Supprimer un utilisateur par son firm_name
 *     description: Endpoint pour supprimer un utilisateur en utilisant son firm_name.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: firm_name
 *         required: true
 *         description: Le firm_name de l'utilisateur à supprimer.
 *         schema:
 *           type: string
 *           example: "NomEntreprise"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès"
 *       400:
 *         description: Le firm_name n'existe pas dans la base de données.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Le firm_name n'existe pas dans la base de données"
 *       404:
 *         description: Utilisateur non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur lors de la suppression de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la suppression de l'utilisateur"
 */

// Route DELETE pour supprimer un utilisateur par son firm_name
router.delete('/user/:firm_name',authenticateUser, UserController.deleteUser);



// Exportation du routeur pour l'utiliser dans d'autres fichiers
// Cela permet au fichier index.js ou tout autre fichier de monter ce routeur sur l'application Express
export default router;
