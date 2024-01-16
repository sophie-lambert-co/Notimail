import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

const mailAdmin =  process.env.MAIL_ADRESS;
const mailPassword =  process.env.MAIL_PASSWORD;


// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // fournisseur de services de messagerie
  auth: {
    user: mailAdmin, //  adresse e-mail de l'ADMIN principal
    pass: mailPassword, // MOT DE PASS 
  },
});

// Fonction pour envoyer un e-mail
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

export { sendEmail };
