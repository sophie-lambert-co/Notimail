// Importations des modules et des fichiers nécessaires pour la gestion des utilisateurs
import connection from "../database.js";
import User from "../modeles/modelUser.js";
// Import du module bcrypt pour le hachage du mot de passe
import bcrypt from "bcrypt";
import {
  verifyFirmName,
  hashUserCode,
  generateUserCode,
} from "../utils/utilSecurisation.js";
import { Sequelize } from "sequelize";
import validator from "validator";
import { sendEmail, sendSMS } from "../utils/notificationsConfig.js";
import validateFields from "../utils/validationFields.js";

//Chaque code de statut HTTP a une signification spécifique. Par exemple, les codes de la série 2xx indiquent que la requête a été reçue, comprise et acceptée avec succès. Les codes de la série 4xx indiquent des erreurs du côté client, tandis que les codes de la série 5xx indiquent des erreurs du côté serveur.

// **2xx (Succès) :
// 200 OK (OK)
// 201 Created (Créé)
// 202 Accepted (Accepté)
// 204 No Content (Pas de contenu)
// 206 Partial Content (Contenu partiel)

// *4xx (Erreur client) :
//400 Bad Request (Requête incorrecte)
//401 Unauthorized (Non autorisé)
//403 Forbidden (Interdit)
//404 Not Found (Non trouvé)

// *5xx (Erreur serveur) :
//500 Internal Server Error (Erreur interne du serveur)
//504 Gateway Timeout (Délai d'attente de la passerelle)

// Classe userController pour gérer les différentes actions liées aux utilisateurs
class userController {
  // Fonction asynchrone pour créer un nouvel utilisateur
  async createUser(req, res) {
    try {
      // Vérifiez si les données requises sont présentes dans le corps de la requête
      const requiredFields = ["firm_name"];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          // Si un champ requis est manquant, renvoyez une réponse avec un statut 400
          return res
            .status(400)
            .json({ error: `Le champ '${field}' est obligatoire` });
        }
      }

      // Vérification des champs du corps de la requête
      const validationErrors = validateFields(req.body);

      // Si des erreurs de validation sont présentes, renvoyer la réponse avec le tableau des erreurs
      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: "Données de la requête non valides",
          errors: validationErrors,
        });
      }

      // Supprimez les espaces au début et à la fin de la chaîne 'firm_name'
      req.body.firm_name = req.body.firm_name.trim();

      // Génère un code utilisateur aléatoire s'il n'y a pas de mot de passe dans la requête
      // l'opérateur || (ou logique). signifie que si req.body.password existe (c'est-à-dire s'il y a un mot de passe dans la requête), alors userCode prendra la valeur de req.body.password. Sinon, si req.body.password n'existe pas (c'est-à-dire qu'il est falsy, par exemple, undefined), alors userCode prendra la valeur générée par generateUserCode().
      let userCode = req.body.password || generateUserCode();

      // la fonction asynchrone hashUserCode pour hacher le code utilisateur (userCode).
      // La fonction hashUserCode est définie pour retourner une promesse résolue avec le code utilisateur haché. L'utilisation de await permet de traiter la promesse et d'attendre que la promesse soit résolue avec la valeur hachée avant de continuer l'exécution du code.
      // Une fois que le hachage du code utilisateur est obtenu, la valeur résultante est stockée dans la variable hashedCode.
      let hashedCode = await hashUserCode(userCode);

      // Crée un nouvel utilisateur avec les données reçues dans la requête
      const newUser = new User(req.body);
      // Hachage du mot de passe
      newUser.password = hashedCode;

      // Sauvegarde le nouvel utilisateur dans la base de données
      await newUser.save();

      // Répond avec le nouvel utilisateur créé en tant que réponse à la requête avec le statut 201 (Created)
      const mail = req.body.email;
      await sendEmail(userCode, "createUser", mail);

      res
        .status(201)
        .json({ message: "POST request successful", data: newUser });
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Fonction asynchrone pour récupérer tous les utilisateurs
  async getAllUser(req, res) {
    try {
      // Récupère tous les utilisateurs depuis la base de données
      const [rows] = await connection.query("SELECT * FROM NOTIMAIL.users");
      // Répond avec les utilisateurs récupérés
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      // En cas d'erreur, répond avec un statut 400 et un message d'erreur
      res
        .status(400)
        .json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  // Fonction asynchrone pour récupérer un utilisateur par son nom d'entreprise (firm_name)
  async getUserByFirmName(req, res) {
    try {
      // Récupère le nom d'entreprise depuis les paramètres de la requête
      const nomEntreprise = req.params.firm_name;

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 404 et un message d'erreur
        return res.status(404).json({
          message: "Le firm_name n'existe pas dans la base de données",
        });
      }

      // Récupère l'utilisateur depuis la base de données par son firm_name
      const user = await User.findOne({ where: { firm_name: nomEntreprise } });
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, répond avec un statut 404 et un message d'erreur
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Renvoie les données de l'utilisateur
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);

      // En cas d'autres erreurs, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: "Erreur serveur interne" });
    }
  }
// Fonction asynchrone pour mettre à jour un utilisateur par son Firm_Name
async updateUser(req, res) {
  try {
    // Récupère le nom d'entreprise depuis les paramètres de la requête
    const nomEntreprise = req.body.firm_name;

    // Vérifie si le nom d'entreprise est valide dans la base de données
    const isValidFirmName = await verifyFirmName(nomEntreprise);

    if (!isValidFirmName) {
      // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
      return res.status(404).json({
        message: "Le firm_name non trouvé dans la base de données",
      });
    }

    // Récupère les champs à mettre à jour depuis le corps de la requête
    const { firm_name, ...updatedFields } = req.body;

    // Recherchez l'utilisateur à mettre à jour
    const existingUser = await User.findOne({ where: { firm_name: nomEntreprise } });

    if (existingUser) {
      // Mettez à jour les champs nécessaires
      existingUser.set(updatedFields);

      // Sauvegardez les modifications dans la base de données
      await existingUser.save();

      // Récupérez les données mises à jour
      const mail = existingUser.email;
      const userCode = existingUser.password;

      // Envoyez l'e-mail à l'utilisateur
      await sendEmail(userCode, "updateUser", mail);

      // Répond avec les données de l'utilisateur mises à jour
      res.status(200).json({
        success: true,
        message: "Mise à jour réussie.",
        updatedUser: req.body,
      });
    } else {
      // Si aucune ligne n'a été mise à jour, répond avec un statut 404 et un message d'erreur
      res.status(404).json({
        success: false,
        message: "Aucun utilisateur mis à jour trouvé.",
      });
    }
  } catch (error) {
    // En cas d'erreur, répond avec un statut 500 et un message d'erreur générique
    console.log("Error during update:", error);
    res.status(500).json({ success: false, error: "Erreur interne du serveur." });
  }
}

  

  // Fonction asynchrone pour supprimer un utilisateur par son firm_name
  async deleteUser(req, res) {
    try {
      // Récupère le nom d'entreprise depuis les paramètres de la requête
      const nomEntreprise = req.params.firm_name;

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
        return res.status(400).json({
          message: "Utilisateur non trouvé",
        });
      }

      // Supprime l'utilisateur par son firm_name depuis la base de données
      const deletedUser = await User.destroy({
        where: { firm_name: nomEntreprise },
      });

      // Répond avec les données de l'utilisateur supprimé
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }

// Fonction asynchrone pour envoyer des notifications
async sendNotification(req, res) {
  try {
    const tab = req.body.notifList;
    console.log(tab, "tab");

    for (let i = 0; i < tab.length; i++) {
      await User.update(
        {
          has_mail: true,
          last_received_mail: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          where: { firm_name: tab[i].firm_name },
        }
      );

      const updatedUser = await User.findOne({
        where: { firm_name: tab[i].firm_name },
        attributes: ["email", "phone_number","password"],
      });

      // Envoi de l'e-mail
      await sendEmail(updatedUser.password,"sendNotification", updatedUser.email);

      // Envoi du SMS
      await sendSMS(updatedUser.phone_number);
    }

    res.status(200).send("Utilisateurs modifiés avec succès et envoi de mail et SMS ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour des utilisateurs et de l'envoi du mail et du sms.");
  }
}

}

// Exporte la classe userController pour pouvoir l'utiliser dans d'autres fichiers
export default userController;
