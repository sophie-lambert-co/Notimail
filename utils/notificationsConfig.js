import axios from "axios";
import { sendMail } from "./emailConfig.js";
import dotenv from "dotenv";

export async function sendEmail(
  password = "",
  action = "sendNotifications",
  mail
) {
  let subjectOption, textOption;

  if (action === "createUser") {
    subjectOption = "Votre profil au 40 a été crée";
    textOption = `Bonjour, Votre profil a été crée, votre mot de passe est : ${password}.`;
  } else if (action === "updateUser") {
    subjectOption = "Votre profil au 40 a été modifié";
    textOption =
      "Bonjour, Votre profil a été modifié, si vous n'êtes pas a l'origine de cette modification n'hésitez pas a contacter Nicolas.";
  } else if (action === "sendNotification") {
    subjectOption = "Reception de courrier";
    textOption = "Bonjour, du courrier vous attend au 40, venez le recuperer.";
  }

  // Options de l'e-mail pour le compte administrateur
  const mailOptions = {
    from: "sophie.lambert@institutsolacroup.com", // ici mettre l'adress de l'Administrateur principal
    to: mail, // ici mettre l'adresse du nouvel Administrateur
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
    // Gestion de l'erreur d'envoi d'e-mail
    console.error("Erreur lors de l'envoi de l'e-mail:", error.message);

    // Affichez des informations supplémentaires sur l'erreur
    console.error("Détails de l'erreur:", error.stack);

    if (error.code === "ENOTFOUND") {
      // Code d'erreur pour une adresse e-mail non trouvée
      throw new Error(
        "Erreur lors de l'envoi de l'e-mail : Adresse e-mail introuvable"
      );
    } else if (error.code === "ECONNREFUSED") {
      // Code d'erreur pour une connexion refusée
      throw new Error("Erreur lors de l'envoi de l'e-mail : Connexion refusée");
    } else {
      // Code d'erreur générique
      throw new Error("Erreur lors de l'envoi de l'e-mail");
    }
  }
}

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const authtoken = process.env.AUTH_TOKEN;

export async function sendSMS(phone_number) {
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
      to: phone_number,
      text: " Bonjour, Merci de venir recuperer votre courrier au 4O. SMS FROM REST API\r\nStop au 36180",
    },
  };

  try {
    // Envoi du SMS
    await axios(smsOptions);
    console.log("SMS envoyé avec succès.");
  } catch (error) {
    // Gestion de l'erreur d'envoi de SMS
    console.error("Erreur lors de l'envoi du SMS:", error.message);
    // Vous pouvez relancer l'erreur ou effectuer d'autres actions en conséquence
    throw new Error("Erreur lors de l'envoi du SMS");
  }
}
