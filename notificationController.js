//import { sendEmail } from "./emailConfig.js";
import userController from './userController.js';

const UserController = new userController();

class sendNotificationController {

  async sendNotification(req, res) {
    try {
      const tableau = req.body.listNotif;

      if (!Array.isArray(tableau)) {
        return res.status(400).json({ message: 'Le format des tableau est incorrect.' });
      }

      // Utilisez Promise.all pour exécuter de manière asynchrone getUserByFirmName pour chaque élément du tableau
      const promises = tableau.map(async (nomObjtableau) => {
        const nomEntreprise = nomObjtableau.firm_name;
        console.log(nomEntreprise);

        try {
          // Utilisez destructuring pour extraire les informations nécessaires
          const { firm_name, email, has_mail, last_received_mail } = await UserController.getUserByFirmName({ params: { firm_name: nomEntreprise } });

          if (!firm_name) {
            return { error: `Utilisateur avec le firm_name ${nomEntreprise} non trouvé.` };
          } else {
            // Retourne les informations nécessaires pour stockage
            return { firm_name, email, has_mail, last_received_mail, message: `Utilisateur avec le firm_name ${nomEntreprise} trouvé.` };
          }
        } catch (error) {
          return { error: error.message };
        }
      });

      // Attendre que toutes les promesses soient résolues
      const results = await Promise.all(promises);

      // Stockez les résultats dans un seul objet JSON
      const jsonResponse = { results };

      // Afficher les résultats
      console.log(jsonResponse);

      // Répondre avec les résultats
      res.json(jsonResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default sendNotificationController;



// import { sendEmail } from "./emailConfig.js";
// import userController from './userController.js';

// const UserController = new userController();

// class sendNotificationController {

//   async sendNotification(req, res) {
//     try {
//         const tableau = req.body.listNotif; // listNotif est le nom du tableau que l'on reçoit.
//         // Utiliser tableau dans le reste du code
        

//       if (!Array.isArray(tableau)) {
//         return res.status(400).json({ message: 'Le format des tableau est incorrect.' });
//       }

//       // Itérer sur chaque élément du tableau
//       for (const nomObjtableau of tableau) {
//         const nomEntreprise = nomObjtableau.firm_name;
//         console.log(nomEntreprise);

//         // Récupérer l'utilisateur par le firm_name
//         const isValidNomEntrprise = await UserController.getUserByFirmName({ params: { firm_name: nomEntreprise } });
//         console.log(isValidNomEntrprise);

//         if (!isValidNomEntrprise) {
//           return res.status(404).json({ message: `Utilisateur avec le firm_name ${nomEntreprise} non trouvé.` });
//         }

//         // Mettre à jour les attributs de l'utilisateur
//         user.has_mail = true;
//         user.last_received_mail = new Date();

//         // Sauvegarder les modifications dans la base de données
//         await UserController.updateUser({
//           params: { firm_name: nomEntreprise },
//           body: { has_mail: user.has_mail, last_received_mail: user.last_received_mail },
//         });

//         const notificationEmail = user.email;

//         // Envoi de l'e-mail de notification de réception de courrier
//         const mailOptions = {
//           from: 'sophie.lambert@institutsolacroup.com',
//           to: notificationEmail,
//           subject: 'Vous avez reçu du courrier',
//           text: `Bonjour ${user.first_name}, Vous avez reçu du courrier.`,
//         };

//         await sendEmail(mailOptions);

//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.log('Erreur lors de l\'envoi de l\'email :', error);
//           } else {
//             console.log('Email envoyé :', info.response);
//           }
//         });
//       }

//       return res.status(200).json({ message: 'Utilisateurs mis à jour avec succès.' });
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour des utilisateurs :', error);
//       return res.status(500).json({ message: 'Erreur lors de la mise à jour des utilisateurs.' });
//     }
//   }
// }

// export default sendNotificationController;
