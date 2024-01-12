// // Importation du module userController pour gérer les opérations liées aux utilisateurs
// import userController from "./userController.js";
// import { sendEmail } from "./emailConfig.js";

// // Création d'une instance de userController pour utiliser ses méthodes
// const UserController = new userController();

// // Définition de la classe sendNotificationController
// class sendNotificationController {
//   // Définition de la fonction asynchrone sendNotification
//   async sendNotification(req, res) {
//     try {
//       // Extraction du tableau d'objets "listNotif" à partir du corps de la requête
//       const tableau = req.body.listNotif;

//       // Vérification si le contenu de "listNotif" est un tableau
//       if (!Array.isArray(tableau)) {
//         // Si le format n'est pas correct, renvoyer une réponse d'erreur avec un code 400
//         return res
//           .status(400)
//           .json({ message: "Le format du tableau est incorrect." });
//       }

//       // Utilisation de Promise.all pour exécuter de manière asynchrone la fonction getUserByFirmName pour chaque élément du tableau
//       const promises = tableau.map(async (nomObjtableau) => {
//         // Extraction du nom de l'entreprise depuis l'objet
//         var nomEntreprise = nomObjtableau.firm_name;

//         // Affichage du nom de l'entreprise dans la console
//         //console.log(nomEntreprise,'nomEntreprise');

//         try {
//           // Utilisation de la fonction getUserByFirmName pour obtenir les informations de l'utilisateur
//           const { firm_name, email, has_mail, last_received_mail } =
//             await UserController.getUserByFirmName({
//               params: { firm_name: nomEntreprise },
//             });

//           // Vérification si l'utilisateur n'a pas été trouvé
//           if (!firm_name) {
//             // Retourner un objet avec un message d'erreur
//             return {
//               error: `Utilisateur avec le firm_name ${nomEntreprise} non trouvé.`,
//             };
//           } else {
//             // Retourner les informations nécessaires pour le stockage
//             return {
//               firm_name,
//               email,
//               has_mail,
//               last_received_mail,
//               message: `Utilisateur avec le firm_name ${nomEntreprise} trouvé.`,
//             };
//           }
//         } catch (error) {
//           // Retourner un objet avec le message d'erreur en cas d'erreur lors de l'exécution de getUserByFirmName
//           return { error: error.message };
//         }
//       });

//       // Attendre que toutes les promesses soient résolues
//       const results = await Promise.all(promises);

//       // Créer un tableau pour stocker les résultats mis à jour
//       const updatedResults = [];

//       // Parcourir les résultats pour mettre à jour chaque utilisateur
//       for (const result of results) {
//         console.log("Result:", result);

//         if (result.firm_name && !result.error) {
//           try {
//             console.log("Updating user for firm_name:", result.firm_name);

//             // Mettre à jour les données nécessaires
//             await UserController.updateUser({
//               params: { firm_name: result.firm_name }, // Clé primaire pour la condition WHERE
//               body: {
//                 // Mettez à jour les données nécessaires
//                 email: result.email,
//                 has_mail: result.has_mail,
//                 last_received_mail: result.last_received_mail,
//                 // Ajoutez d'autres champs à mettre à jour si nécessaire
//               },
//             });
//             updatedResults.push(result);
//           } catch (error) {
//             // Gérer les erreurs liées à la mise à jour de l'utilisateur
//             // Vous pouvez ajouter des logs ou des messages d'erreur personnalisés selon vos besoins
//             console.error(
//               `Erreur lors de la mise à jour de l'utilisateur ${result.firm_name}: ${error.message}`
//             );
//             console.log("Error result:", result);
//           }
//         }
//       }
//       // Stocker les résultats mis à jour dans un objet JSON
//       const jsonResponse = { updatedResults };

//       // Afficher les résultats dans la console
//       console.log(jsonResponse);

//       // Répondre avec les résultats au format JSON
//       res.json(jsonResponse);
//     } catch (error) {
//       // En cas d'erreur, répondre avec un code 500 et le message d'erreur
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// // Exportation de la classe sendNotificationController
// export default sendNotificationController;
