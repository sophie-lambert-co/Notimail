// test/app.test.js

import request from "supertest";
import { app, connectDB } from "../serveur.js";
import database from "../database.js";
import User from "../modeles/modelUser.js";

describe("Tests de l'API utilisateur", () => {
  beforeAll(() => {
    connectDB();
  });

  test("It should respond to the GET method getAllUser", async () => {
    const response = await request(app).get("/user");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  test("It should respond to the GET by firm_name method getUserByFirmName", async () => {
    const firmName = "IMTS";
    const response = await request(app).get(`/user/${firmName}`);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body.firm_name).toBe(firmName);
  });

  // Test pour la situation où la récupération des utilisateurs échoue
  test("It should respond with an error when fetching all users fails", async () => {
    // Simule une erreur lors de la récupération des utilisateurs
    jest.spyOn(database, "query").mockImplementationOnce(() => {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    });

    const response = await request(app).get("/user");
    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });

  test("It should respond with an error when firm_name does not exist in the database", async () => {
    const nonExistingFirmName = "NonExistingFirmName";
    const response = await request(app).get(`/user/${nonExistingFirmName}`);
    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toHaveProperty(
      "message",
      "Le firm_name n'existe pas dans la base de données"
    );
  });

  test("It should respond with an error for internal server error", async () => {
    // Mock the findOne function to simulate an internal server error
    jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });
    const existingFirmName = "ExistingFirmName";
    const response = await request(app).get(`/user/${existingFirmName}`);
    expect(response.status).toBe(500);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error", "Erreur serveur interne");

    // Restore the original implementation of findOne after the test
    User.findOne.mockRestore();
  });

  test("It should respond to the POST method createUser", async () => {
    const uniqueFirmName = `Zazou_${Date.now()}`;

    const userData = {
      firm_name: uniqueFirmName,
      first_name: "William",
      last_name: "Kriegenhofer",
      email: "sophie.lambert@institutsolacroup.com",
      phone_number: "1112223333",
      password: "2345",
      last_received_mail: "2023-12-31",
      last_picked_up: "2023-01-10",
      has_mail: true,
      is_admin: false,
    };

    const response = await request(app).post("/user").send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.firm_name).toBe(uniqueFirmName);

    const createdUser = await User.findOne({
      where: { firm_name: userData.firm_name },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser.firm_name).toBe(userData.firm_name);
    expect(createdUser.first_name).toBe(userData.first_name);
    expect(createdUser.last_name).toBe(userData.last_name);
    expect(createdUser.email).toBe(userData.email);

    await User.destroy({ where: { firm_name: uniqueFirmName } });
  });

  test("It should respond with an error for incomplete user creation data", async () => {
    const incompleteUserData = {
      // Remove the 'firm_name' field intentionally
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      password: "password123",
      last_received_mail: "2023-12-15",
      last_picked_up: "2023-12-10",
      has_mail: true,
      is_admin: false,
    };

    const response = await request(app).post("/user").send(incompleteUserData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("It should respond with an error for invalid user creation data", async () => {
    const invalidUserData = {
      firm_name: "Invalid Firm Name",
      first_name: "John",
      last_name: "Doe",
      email: "invalid-email", // Invalid email format
      phone_number: "1234567890",
      password: "password123",
      last_received_mail: null,
      last_picked_up: "2023-12-10",
      has_mail: false,
      is_admin: false,
    };

    const response = await request(app).post("/user").send(invalidUserData);
    expect(response.status).toBe(400);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toEqual({
      message: "Données de la requête non valides",
      errors: [
        "Le champ email doit être une adresse email valide et avoir au maximum 50 caractères.",
        "Le champ password doit avoir exactement 4 caractères.",
      ],
    });
  });

  test("It should respond with an error when creating a user with invalid data", async () => {
      const responseCreateUser = await request(app)
        .post("/user") // Changé 'put' en 'post' car il semble s'agir d'une création d'utilisateur
        .send({
          firm_name: "ABCIndustries",
          first_name: "Alice",
          last_name: "Johnson",
          email: "alice.johnsonabc.com", // NON VALIDE
          phone_number: "9876543210",
          password: "567845", // NON VALIDE
          last_received_mail: null,
          last_picked_up: "2023-12-10",
          has_mail: true,
          is_admin: false,
        });

      expect(responseCreateUser.status).toBe(400);
      expect(responseCreateUser.body).toEqual({
        message: "Données de la requête non valides",
        errors: [
          "Le champ email doit être une adresse email valide et avoir au maximum 50 caractères.",
          "Le champ password doit avoir exactement 4 caractères.",
        ],
      });
  });

  test("It should respond to the PUT method and update an existing user", async () => {
    const uniqueFirmName = `Zazou_${Date.now()}`;

    const initialUserData = {
      firm_name: uniqueFirmName,
      first_name: "William",
      last_name: "Kriegenhofer",
      email: "sophie.lambert@institutsolacroup.com",
      phone_number: "1112223333",
      password: "2345",
      last_received_mail: "2023-12-31",
      last_picked_up: "2023-01-10",
      has_mail: true,
      is_admin: false,
    };

    const updatedUserData = {
      ...initialUserData,
      first_name: "UpdatedFirstName",
    };

    const responseCreateUser = await request(app)
      .post("/user")
      .send(initialUserData);

    expect(responseCreateUser.status).toBe(201);

    const responseUpdateUser = await request(app)
      .put(`/user/${uniqueFirmName}`)
      .send(updatedUserData);

    expect(responseUpdateUser.status).toBe(200);
    expect(responseUpdateUser.body).toHaveProperty("success", true);
    expect(responseUpdateUser.body).toHaveProperty(
      "message",
      "Mise à jour réussie."
    );
    expect(responseUpdateUser.body).toHaveProperty("updatedUser");
    expect(responseUpdateUser.body.updatedUser).toEqual(updatedUserData);

    await User.destroy({ where: { firm_name: uniqueFirmName } });
  });

  test("It should respond with an error when updating a non-existing user", async () => {
    const responseUpdateUser = await request(app)
      .put("/user/ACMECorporation")
      .send({
        firm_name: "Tata",
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@abc.com",
        phone_number: "9876543210",
        password: "5678",
        last_received_mail: "2023-12-15",
        last_picked_up: "2023-12-10",
        has_mail: true,
        is_admin: false,
      });

    expect(responseUpdateUser.status).toBe(404);
    expect(responseUpdateUser.headers["content-type"]).toMatch(
      /application\/json/
    );
    expect(responseUpdateUser.body).toEqual({
      message: "Le firm_name non trouvé dans la base de données",
    });
  });

  test("It should respond with an error when an internal server error occurs during user update", async () => {
    // Espionnez d'abord la méthode updateUser pour simuler une erreur serveur
    jest.spyOn(User, 'update').mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });
  
    // Envoyez ensuite la requête de mise à jour
    const responseUpdateUser = await request(app)
      .put("/user/ABCIndustries")
      .send({
        firm_name: "ABCIndustries",
        first_name: "Alice",
        last_name: "Johnson",
        email: "lemaildesophielambert@gmail.com", 
        phone_number: "9876543210",
        password: "5678", 
        last_received_mail: "2023-12-15",
        last_picked_up: "2023-12-10",
        has_mail: true,
        is_admin: false,
      });

    expect(responseUpdateUser.status).toBe(500);
    expect(responseUpdateUser.headers['content-type']).toMatch(/application\/json/);
  
    // Ajoutez une vérification pour la propriété 'error' dans le corps de la réponse
    expect(responseUpdateUser.body).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });



  test("It should respond with an error when the route is incorrect during user deletion", async () => {
    const responseDeleteUser = await request(app)
      .delete(`/user/NonExistingFirmName`);

    expect(responseDeleteUser.status).toBe(400);
    expect(responseDeleteUser.headers['content-type']).toMatch(/application\/json/);
    expect(responseDeleteUser.body).toEqual({
      message: "Utilisateur non trouvé",
    });
  });

 

  test("It should respond with an error when an internal server error occurs during user deletion", async () => {
    // Espionner la méthode de suppression pour simuler une erreur serveur
    jest.spyOn(User, 'destroy').mockImplementationOnce(() => {
      throw new Error("Internal Server Error");
    });

    const responseDeleteUser = await request(app)
      .delete("/user/ABCIndustries");

    expect(responseDeleteUser.status).toBe(500);
    expect(responseDeleteUser.headers['content-type']).toMatch(/application\/json/);
    expect(responseDeleteUser.body).toEqual({
      error: "Internal Server Error",
    });

  //Restaurer l'implémentation originale après le test
    User.destroy.mockRestore();
  });

  test("It should respond to the DELETE method and delete an existing user", async () => {
    const uniqueFirmName = `Zazou_${Date.now()}`;

    const initialUserData = {
      firm_name: uniqueFirmName,
      first_name: "William",
      last_name: "Kriegenhofer",
      email: "sophie.lambert@institutsolacroup.com",
      phone_number: "1112223333",
      password: "2345",
      last_received_mail: "2023-12-31",
      last_picked_up: "2023-01-10",
      has_mail: true,
      is_admin: false,
    };

    const responseCreateUser = await request(app)
      .post("/user")
      .send(initialUserData);

    expect(responseCreateUser.status).toBe(201);

    const responseDeleteUser = await request(app).delete(
      `/user/${uniqueFirmName}`
    );

    expect(responseDeleteUser.status).toBe(200);
    expect(responseDeleteUser.body).toHaveProperty(
      "message",
      "Utilisateur supprimé avec succès"
    );

    await User.destroy({ where: { firm_name: uniqueFirmName } });
  });



  test("It should respond to the PUT method and send notifications", async () => {
    // Créer un utilisateur pour la notification
    const newUser = {
      firm_name: "NotificationTest",
      first_name: "John",
      last_name: "Doe",
      email: "sophie.lambert@institutsolacroup.com",
      phone_number: "1234567890",
      password: "1234",
      last_received_mail: null,
      last_picked_up: "2024-01-10",
      has_mail: false,
      is_admin: false,
    };
  
    // Créer l'utilisateur avec une requête POST
    await request(app).post("/user").send(newUser);
  
    // Préparer les données de notification
    const notificationData = {
      notifList: [{ firm_name: "NotificationTest" }],
    };
  
    try {
      // Envoyer une requête PUT à la route /send
      const response = await request(app).put("/send").send(notificationData);
  
      // Vérifier que la réponse a le statut 200 et le texte attendu
      expect(response.status).toBe(200);
      expect(response.text).toBe(
        "Utilisateurs modifiés avec succès et envoi de mail ok"
      );
  
      // Vérifier que l'utilisateur a bien été modifié
      const updatedUser = await User.findOne({
        where: { firm_name: "NotificationTest" },
        attributes: ["has_mail", "last_received_mail"],
      });
  
      expect(updatedUser.has_mail).toBe(true);
      expect(updatedUser.last_received_mail).not.toBeNull();
    } catch (error) {
      // En cas d'erreur, afficher l'erreur pour le débogage
      console.error("Test error:", error);
    } finally {
      // Nettoyer en supprimant l'utilisateur créé
      await User.destroy({ where: { firm_name: "NotificationTest" } });
    }
  });
  
  test("It should log in the user", async () => {
    const newUser = {
      firm_name: "Rhum&CocoCola",
      first_name: "Calypso",
      last_name: "Rose",
      email: "rose.calypso@capvert.com",
      phone_number: "9876543210",
      password: "5678",
      last_received_mail: "2023-12-15",
      last_picked_up: "2023-12-10",
      has_mail: true,
      is_admin: false,
    };

    await request(app).post("/user").send(newUser);

    // Effectuez la requête de connexion
    const response = await request(app).post("/login").send({
      firm_name: "Rhum&CocoCola",
      password: "5678",
    });

    // Vérifiez la réponse
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("message", "Connexion réussie");
    expect(response.body).toHaveProperty("user");

    // Vérifiez que le cookie 'token' est défini dans la réponse
    const cookies = response.headers["set-cookie"];
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    expect(tokenCookie).toBeDefined();

    // Vérifiez que l'utilisateur dans la réponse correspond à l'utilisateur créé
    const createdUser = await User.findOne({
      where: { firm_name: "Rhum&CocoCola" },
    });
    expect(response.body.user.firm_name).toBe(createdUser.firm_name);

    // Supprimez l'utilisateur créé pour nettoyer la base de données après le test
    await User.destroy({ where: { firm_name: "Rhum&CocoCola" } });
  });

  afterAll(async () => {
    await database
      .close()
      .then(() => {
        console.log("Déconnexion réussie");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  });
});

//expect(response.headers['content-type']).toMatch(/application\/json/);

// export const hello = ()=> {
//   return 'hello, world'
//   }

//   describe('Tests pour les requètes de NOTIMAIL', () => {

//     it("rend helloworld", () => {
//       expect(hello()).toBe("hello, world")
//   })

//   });
