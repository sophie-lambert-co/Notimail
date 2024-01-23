// Importations des modules et des fichiers nécessaires pour la gestion des utilisateurs
import connection from "../database.js";
import User from "../modeles/modelUser.js";
// Import du module bcrypt pour le hachage du mot de passe
import bcrypt from "bcrypt";
import { verifyFirmName, saltRounds } from "../utils/utilSecurisation.js";
import { sendEmail } from "../utils/emailConfig.js"; // Importer le fichier de configuration d'e-mail
import { Sequelize } from "sequelize";
import axios from "axios";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const authtoken = process.env.AUTH_TOKEN;

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
      //console.log(req.body.password);
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
      const {
        firm_name,
        first_name,
        last_name,
        email,
        phone_number,
        password,
        last_received_mail,
        last_picked_up,
        has_mail,
        is_admin,
      } = req.body;
      const validationErrors = [];

      if (!validator.isLength(first_name, { max: 25 })) {
        validationErrors.push(
          "Le champ first_name doit avoir au maximum 25 caractères."
        );
      }

      if (!validator.isLength(last_name, { max: 25 })) {
        validationErrors.push(
          "Le champ last_name doit avoir au maximum 25 caractères."
        );
      }

      if (
        !validator.isEmail(email) ||
        !validator.isLength(email, { max: 50 })
      ) {
        validationErrors.push(
          "Le champ email doit être une adresse email valide et avoir au maximum 50 caractères."
        );
      }

      if (!validator.isLength(phone_number, { max: 50 })) {
        validationErrors.push(
          "Le champ phone_number doit avoir au maximum 50 caractères."
        );
      }

      if (!validator.isLength(password, { min: 4, max: 4 })) {
        validationErrors.push(
          "Le champ password doit avoir exactement 4 caractères."
        );
      }

      if (!validator.isDate(last_picked_up)) {
        validationErrors.push(
          "Le champ last_picked_up doit être une date valide."
        );
      }

      if (typeof has_mail !== "boolean" || typeof is_admin !== "boolean") {
        validationErrors.push(
          "Les champs has_mail et is_admin doivent être de type boolean."
        );
      }


       // Si des erreurs de validation sont présentes, renvoyer la réponse avec le tableau des erreurs
       if (validationErrors.length > 0) {
        return res
          .status(400)
          .json({
            message: "Données de la requête non valides",
            errors: validationErrors,
          });
      }

      // Supprimez les espaces au début et à la fin de la chaîne 'firm_name'
      req.body.firm_name = req.body.firm_name.trim();

      let userCode = "";
      let hashedCode = "";

      // Crée un nouvel utilisateur avec les données reçues dans la requête
      const newUser = new User(req.body);

      if (!req.body.password) {
        // Générer un code utilisateur aléatoire s'il n'y a pas de mot de passe dans la requête
        const code = Math.floor(1000 + Math.random() * 9000);
        userCode = code.toString().padStart(4, "0"); // Assurez-vous d'avoir toujours 4 chiffres
        //console.log("Code utilisateur généré :", userCode);
      } else {
        userCode = req.body.password; // Utiliser le mot de passe de la requête s'il existe
      }
      hashedCode = await bcrypt.hash(userCode, saltRounds); // Hachage du code
      //console.log(hashedCode, userCode);
      newUser.password = hashedCode;
      // Sauvegarde le nouvel utilisateur dans la base de données
      await newUser.save();
      // Répond avec le nouvel utilisateur créé en tant que réponse à la requête avec le statut 201 (Created)
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
      console.log("updateUser firm_name :", nomEntreprise);
      console.log("updateUser body :", req.body);

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);
      //console.log("updateUser nom entrprise", nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
        return res.status(404).json({
          message: "Le firm_name non trouvé dans la base de données",
        });
      }

      // Récupère les champs à mettre à jour depuis le corps de la requête
      const { firm_name, ...updatedFields } = req.body; //
      console.log("updateUser req.body: ", req.body);
      console.log("updateUser req.body: ", req.body)

      // Vérification des champs du corps de la requête
      const {
        first_name,
        last_name,
        email,
        phone_number,
        password,
        last_received_mail,
        last_picked_up,
        has_mail,
        is_admin,
      } = updatedFields;
      const validationErrors = [];

      if (!validator.isLength(first_name, { max: 25 })) {
        validationErrors.push(
          "Le champ first_name doit avoir au maximum 25 caractères."
        );
      }

      if (!validator.isLength(last_name, { max: 25 })) {
        validationErrors.push(
          "Le champ last_name doit avoir au maximum 25 caractères."
        );
      }

      if (
        !validator.isEmail(email) ||
        !validator.isLength(email, { max: 50 })
      ) {
        validationErrors.push(
          "Le champ email doit être une adresse email valide et avoir au maximum 50 caractères."
        );
      }

      if (!validator.isLength(phone_number, { max: 50 })) {
        validationErrors.push(
          "Le champ phone_number doit avoir au maximum 50 caractères."
        );
      }

      if (!validator.isLength(password, { min: 4, max: 4 })) {
        validationErrors.push(
          "Le champ password doit avoir exactement 4 caractères."
        );
      }

      if (!validator.isDate(last_received_mail)) {
        validationErrors.push(
          "Le champ last_received_mail doit être une date valide."
        );
      }

      if (!validator.isDate(last_picked_up)) {
        validationErrors.push(
          "Le champ last_picked_up doit être une date valide."
        );
      }

      if (typeof has_mail !== "boolean" || typeof is_admin !== "boolean") {
        validationErrors.push(
          "Les champs has_mail et is_admin doivent être de type boolean."
        );
      }

      // Si des erreurs de validation sont présentes, renvoyer la réponse avec le tableau des erreurs
      if (validationErrors.length > 0) {
        return res
          .status(400)
          .json({
            message: "Données de la requête non valides",
            errors: validationErrors,
          });
      }

      // Utilisez les données fournies dans le corps de la requête pour mettre à jour l'utilisateur
      const rowsUpdated = await User.update(updatedFields, {
        where: { firm_name: nomEntreprise },
      });

      console.log("Rows updated:", rowsUpdated); // Ajoutez cette ligne pour voir le nombre de lignes mises à jour

      // Récupère l'adresse e-mail du nouvel administrateur après la mise à jour
      const newInfoUserEmail = updatedFields.email; // Mettez ici le champ qui contient l'adresse e-mail du nouvel

      // Options de l'e-mail pour le compte administrateur
      const mailOptions = {
        from: "sophie.lambert@institutsolacroup.com", // ici mettre l'adress de l'Administrateur principal
        to: newInfoUserEmail, // ici mettre l'adresse du nouvel Administrateur
        subject: "Modification de vos informations personelles",
        text: "Bonjour, Votre compte utilisateur a été modifié avec succès.",
      };
      console.log(newInfoUserEmail);

      //Appel de la fonction pour envoyer l'e-mail
      await sendEmail(mailOptions);

      // Répond avec les données de l'utilisateur mises à jour
      res.status(200).json({
        success: true,
        message: "Mise à jour réussie.",
        updatedUser: req.body,
      });
    } catch (error) {
      console.log("Error during update:", error); // Ajoutez cette ligne pour voir l'erreur
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ success: false, error: error.message });
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
            where: { firm_name: tab[i].firm_name }, // Correction de la clé firrm_name à firm_name
          }
        );

        // Récupère l'adresse e-mail du nouvel administrateur après la mise à jour
        const updatedUser = await User.findOne({
          where: { firm_name: tab[i].firm_name },
          attributes: ["email", "phone_number"],
        });

        const updateUserNotif = updatedUser ? updatedUser.email : null;
        console.log(updateUserNotif);

        const updateUserSms = updatedUser ? updatedUser.phone_number : null;
        console.log(updateUserSms);

        // Options de l'e-mail pour le compte administrateur
        const mailOptions = {
          from: "sophie.lambert@institutsolacroup.com", // ici mettre l'adress de l'Administrateur principal
          to: updateUserNotif, // ici mettre l'adresse du nouvel Administrateur
          subject: "Vous avez reçu du courrier",
          text: "Bonjour, Merci de venir recuperer votre courrier au 4O.",
        };
        console.log(updateUserNotif);

        // Options du sms pour le compte administrateur
        const smsOptions = {
          method: "post",
          url: "https://api.allmysms.com/sms/send",
          headers: {
            "cache-control": "no-cache",
            Authorization: authtoken,
            "Content-Type": "application/json",
          },
          data: {
            from: "LE 40",
            to: updateUserSms,
            text: " Bonjour, Merci de venir recuperer votre courrier au 4O. SMS FROM REST API\r\nStop au 36180",
          },
        };

        // axios est une requète
        // Envoi du SMS
        try {
          const response = await axios(smsOptions);
          console.log(response.data, "SMS envoyé");
        } catch (error) {
          console.error(error, "Échec de l'envoi du SMS");
        }

        // Envoi de l'e-mail
        await sendEmail(mailOptions);
      }

      res
        .status(200)
        .send("Utilisateurs modifiés avec succès et envoi de mail ok");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send(
          "Erreur lors de la mise à jour des utilisateurs et de l'envoi du mail."
        );
    }
  }
}

// Exporte la classe userController pour pouvoir l'utiliser dans d'autres fichiers
export default userController;
