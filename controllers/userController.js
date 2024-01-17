// Importations des modules et des fichiers nécessaires pour la gestion des utilisateurs
import connection from "../connectDB.js";
import User from "../modeles/modelUser.js";
// Import du module bcrypt pour le hachage du mot de passe
import bcrypt from "bcrypt";
import { verifyFirmName, saltRounds } from "../utils/utilSecurisation.js";
import { sendEmail } from "../utils/emailConfig.js"; // Importer le fichier de configuration d'e-mail
import { Sequelize } from "sequelize";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const authtoken = process.env.AUTH_TOKEN ;

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
      res.status(400).send("Erreur lors de la récupération des utilisateurs");
    }
  }

  // Fonction asynchrone pour récupérer un utilisateur par son nom d'entreprise (firm_name)
  async getUserByFirmName(req, res) {
    try {
      // Récupère le nom d'entreprise depuis les paramètres de la requête
      const nomEntreprise = req.params.firm_name;
      console.log(req.params);

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
        return res.status(400).json({
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
      console.log(error);
      // En cas d'erreur, répond avec un statut 404 et un message d'erreur
      res.status(404).json({ error: error.message });
    }
  }

  // Fonction asynchrone pour mettre à jour un utilisateur par son Firm_Name
  async updateUser(req, res) {
    try {
      // Récupère le nom d'entreprise depuis les paramètres de la requête
      const nomEntreprise = req.params.firm_name;
      //console.log("updateUser firm_name :", nomEntreprise);

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);
      //console.log("updateUser nom entrprise", nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
        return res.status(400).json({
          message: "Le firm_name n'existe pas dans la base de données",
        });
      }

      // Récupère les champs à mettre à jour depuis le corps de la requête
      const { firm_name, ...updatedFields } = req.body; //
      console.log("updateUser req.body: ", req.body);

      // Utilisez les données fournies dans le corps de la requête pour mettre à jour l'utilisateur
      const rowsUpdated = await User.update(updatedFields, {
        where: { firm_name: nomEntreprise },
      });

      if (rowsUpdated === 0) {
        // Si aucun enregistrement n'est mis à jour, cela signifie que l'utilisateur n'a pas été trouvé
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }

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
          message: "Le firm_name n'existe pas dans la base de données",
        });
      }

      // Supprime l'utilisateur par son firm_name depuis la base de données
      const deletedUser = await User.destroy({
        where: { firm_name: nomEntreprise },
      });

      // Vérifie si l'utilisateur a été supprimé
      if (deletedUser === 0) {
        // Si l'utilisateur n'a pas été trouvé, répond avec un statut 404 et un message d'erreur
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

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
      console.log(tab,'tab');

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
          attributes: ["email","phone_number"]
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
            console.log(response.data, 'SMS envoyé');
          } catch (error) {
            console.error(error, 'Échec de l\'envoi du SMS');
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
