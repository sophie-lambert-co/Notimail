/**
 * @file emailConfig.js
 * @description Configuration du transporteur SMTP pour l'envoi d'e-mails.
 * @module emailConfig
 */

import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

// Récupération des informations d'authentification à partir des variables d'environnement
const mailAdmin =  process.env.MAIL_ADRESS;
const mailPassword =  process.env.MAIL_PASSWORD;

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Fournisseur de services de messagerie
  auth: {
    user: mailAdmin, // Adresse e-mail de l'ADMIN principal
    pass: mailPassword, // Mot de passe de l'adresse e-mail
  },
});

/**
 * Fonction pour envoyer un e-mail.
 *
 * @param {Object} mailOptions - Options de l'e-mail à envoyer.
 * @param {string} mailOptions.from - Adresse e-mail de l'expéditeur.
 * @param {string} mailOptions.to - Adresse e-mail du destinataire.
 * @param {string} mailOptions.subject - Sujet de l'e-mail.
 * @param {string} mailOptions.text - Corps de l'e-mail (texte brut).
 * @returns {Promise} - Promesse résolue en cas de succès, rejetée en cas d'échec.
 */
export function sendMail (mailOptions) {
  return new Promise((resolve, reject) => {
    // Utilisation du transporteur pour envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // Rejet de la promesse en cas d'erreur
        reject(error);
      } else {
        // Résolution de la promesse en cas de succès
        resolve(info);
      }
    });
  });
}
