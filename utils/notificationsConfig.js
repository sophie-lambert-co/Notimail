/**
 * @file notificationService.js
 * @description Fournit des fonctions pour l'envoi d'e-mails et de SMS de notification.
 * @module notificationService
 */

import axios from "axios";
import { sendMail } from "./emailConfig.js";
import dotenv from "dotenv";

/**
 * Envoie un e-mail de notification en fonction de l'action spécifiée.
 *
 * @param {string} [password=""] - Mot de passe à inclure dans l'e-mail (optionnel).
 * @param {string} [action="sendNotifications"] - Action à effectuer (par défaut : "sendNotifications").
 * @param {string} mail - Adresse e-mail du destinataire.
 * @throws {Error} Lance une erreur si l'envoi de l'e-mail échoue.
 */
export async function sendEmail(password = "", action = "sendNotifications", mail) {
  let subjectOption, textOption;

  // Détermine le sujet et le texte de l'e-mail en fonction de l'action
  if (action === "createUser") {
    subjectOption = "Votre profil au 40 a été créé";
    textOption = `Bonjour, Votre profil a été créé, votre mot de passe est : ${password}.`;
  } else if (action === "updateUser") {
    subjectOption = "Votre profil au 40 a été modifié";
    textOption =
      "Bonjour, Votre profil a été modifié, si vous n'êtes pas à l'origine de cette modification, n'hésitez pas à contacter Nicolas.";
  } else if (action === "sendNotification") {
    subjectOption = "Réception de courrier";
    textOption = "Bonjour, du courrier vous attend au 40, venez le récupérer.";
  }

  // Options de l'e-mail pour le compte administrateur
  const mailOptions = {
    from: "sophie.lambert@institutsolacroup.com",
    to: mail,
    subject: subjectOption,
    text: textOption,
  };

  try {
    // Tentative d'envoi de l'e-mail
    await sendMail(mailOptions);
    console.log("E-mail envoyé avec succès.");
  } catch (error) {
    // Gestion de l'erreur d'envoi d'e-mail
    console.error("Erreur lors de l'envoi de l'e-mail:", error.message);

    // Affichez des informations supplémentaires sur l'erreur
    console.error("Détails de l'erreur:", error.stack);

    // Gestion d'erreurs spécifiques
    if (error.code === "ENOTFOUND") {
      throw new Error("Erreur lors de l'envoi de l'e-mail : Adresse e-mail introuvable");
    } else if (error.code === "ECONNREFUSED") {
      throw new Error("Erreur lors de l'envoi de l'e-mail : Connexion refusée");
    } else {
      throw new Error("Erreur lors de l'envoi de l'e-mail");
    }
  }
}

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const authtoken = process.env.AUTH_TOKEN;

/**
 * Envoie un SMS de notification à un numéro de téléphone.
 *
 * @param {string} phone_number - Numéro de téléphone du destinataire.
 * @throws {Error} Lance une erreur si l'envoi du SMS échoue.
 */
export async function sendSMS(phone_number) {
  // Options du SMS pour le compte administrateur
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
      to: phone_number,
      text: "Bonjour, Merci de venir récupérer votre courrier au 40. SMS FROM REST API\r\nStop au 36180",
    },
  };

  try {
    // Envoi du SMS
    await axios(smsOptions);
    console.log("SMS envoyé avec succès.");
  } catch (error) {
    // Gestion de l'erreur d'envoi de SMS
    console.error("Erreur lors de l'envoi du SMS:", error.message);
    
    // Relance l'erreur pour une gestion ultérieure si nécessaire
    throw new Error("Erreur lors de l'envoi du SMS");
  }
}
