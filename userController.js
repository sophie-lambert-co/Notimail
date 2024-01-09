// Importations des modules et des fichiers nécessaires pour la gestion des utilisateurs
import connection from "./connectDB.js";
import User from "./modelUser.js";
// Import du module bcrypt pour le hachage du mot de passe
import bcrypt from "bcrypt";
import { verifyFirmName, saltRounds } from "./utils.js";

// Classe userController pour gérer les différentes actions liées aux utilisateurs
class userController {
  // Fonction asynchrone pour créer un nouvel utilisateur
  async createUser(req, res) {
    try {
      console.log(req.body.password);

      let userCode = "";
      let hashedCode = "";

      // Crée un nouvel utilisateur avec les données reçues dans la requête
      const newUser = new User(req.body);

      if (!req.body.password) {
        // Générer un code utilisateur aléatoire s'il n'y a pas de mot de passe dans la requête
        const code = Math.floor(1000 + Math.random() * 9000);
        userCode = code.toString().padStart(4, "0"); // Assurez-vous d'avoir toujours 4 chiffres
        console.log("Code utilisateur généré :", userCode);
      } else {
        userCode = req.body.password; // Utiliser le mot de passe de la requête s'il existe
      }
      hashedCode = await bcrypt.hash(userCode, saltRounds); // Hachage du code
      console.log(hashedCode, userCode);
newUser.password = hashedCode
      // Sauvegarde le nouvel utilisateur dans la base de données
      await newUser.save();
      // Répond avec le nouvel utilisateur créé en tant que réponse à la requête avec le statut 201 (Created)
      res.status(201).json(newUser);
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }

  // Fonction asynchrone pour récupérer tous les utilisateurs
  async getAllUser(req, res) {
    try {
      // Récupère tous les utilisateurs depuis la base de données
      const [rows] = await connection.query("SELECT * FROM NOTIMAIL.users");
      // Répond avec les utilisateurs récupérés
      res.json(rows);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).send("Erreur lors de la récupération des utilisateurs");
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
        return res
          .status(400)
          .json({
            message: "Le firm_name n'existe pas dans la base de données",
          });
      }

      // Récupère l'utilisateur depuis la base de données par son firm_name
      const user = await User.findOne({ where: { firm_name: nomEntreprise } });

      if (!user) {
        // Si l'utilisateur n'est pas trouvé, répond avec un statut 404 et un message d'erreur
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Répond avec les données de l'utilisateur
      res.json(user);
    } catch (error) {
      console.log(error);
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }

  // Fonction asynchrone pour mettre à jour un utilisateur par son Firm_Name
  async updateUser(req, res) {
    try {
      // Récupère le nom d'entreprise depuis les paramètres de la requête
      const nomEntreprise = req.params.firm_name;
      console.log("updateUser firm_name :", nomEntreprise);

      // Vérifie si le nom d'entreprise est valide dans la base de données
      const isValidFirmName = await verifyFirmName(nomEntreprise);
      console.log("updateUser nom entrprise", nomEntreprise);

      if (!isValidFirmName) {
        // Si le nom d'entreprise n'est pas valide, répond avec un statut 400 et un message d'erreur
        return res
          .status(400)
          .json({
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
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Récupère les données de l'utilisateur mis à jour depuis la base de données
      // const updatedUser = await User.findOne({ where: { firm_name: nomEntreprise } });

      // Répond avec les données de l'utilisateur mises à jour
      res.json(req.body);
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
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
        return res
          .status(400)
          .json({
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
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      // En cas d'erreur, répond avec un statut 500 et un message d'erreur
      res.status(500).json({ error: error.message });
    }
  }
}

// Exporte la classe userController pour pouvoir l'utiliser dans d'autres fichiers
export default userController;
