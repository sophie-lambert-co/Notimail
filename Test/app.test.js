// test/app.test.js

//npm test -- --detectOpenHandles

// Lorsque vous faites Request(app), cela signifie que vous utilisez supertest pour envelopper votre application app dans un objet qui vous permet d'effectuer des requêtes HTTP sans avoir à lancer réellement le serveur. Cela rend les tests plus rapides et plus isolés, car ils s'exécutent dans un environnement de test sans nécessiter un serveur réel en cours d'exécution.

// La création de l'instance de votre application à l'aide de Request(app) est une partie cruciale de l'utilisation de supertest pour tester vos routes et vos endpoints sans nécessiter le démarrage du serveur réel. Cela permet de s'assurer que les tests sont bien isolés et ne dépendent pas de l'état réel du serveur en cours d'exécution.


// importe le module Request de la bibliothèque supertest. Cette bibliothèque est utilisée pour effectuer des requêtes HTTP dans les tests.
// importe l'objet app depuis le fichier serveur.js. Cet objet représente votre application Express.
import Request from "supertest";
import { app } from "../serveur";

// Suite de tests pour la récupération de tous les utilisateurs ou d'un utilisateur par son firm_name , ROUTE GET, methode // **getAllUser** // ** getUserByFirmName
describe('Tests pour les requètes de NOTIMAIL', () => {

  

    beforeAll(async () => {
        // Connecter la base de données mais ne pas démarrer le serveur express
        await connection(); 
    });

  // Test pour la récupération réussie de tous les utilisateurs
  it('GET /user devrait retourner un statut 200 et la liste des utilisateurs', async () => {
    // Effectuer une requête HTTP GET vers l'endpoint /user
    const response = await Request(app).get('/user');
    // S'assurer que le statut de la réponse est 200 (OK)
    expect(response.status).toBe(200);
  });



    // Nous choisissons de ne pas tester la route POST pour la creation d'un admin car l'application ne se lancera pas si l'admin n'est pas creer .

    // Test pour la requête POST pour creer un user // **createUser
    it('POST /api/endpoint devrait retourner un statut 201', async () => {
        const postData = {  first_name: "Clothilde",
        last_name: "Sophie",
        firm_name: "kshkjdhjsdhfks",
        email: "clo@gmail.com",
        phone_number: "00-00-00-00-00",
        password: "5678"
        };
        const response = await Request(app)
            .post('/user')
            .send(postData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('POST request successful');
        expect(response.body.data).toEqual({
            ...postData,
            is_admin: false,
            password: expect.any(String)
        });
    });

    afterAll(() => {
        // Netoyage de la base de donnée après tout les tests
    })

    afterAll(async () => {
        // Nettoyage de la base de données après tous les tests
        await clearDatabase(); // Remplacez cette fonction par la fonction réelle pour nettoyer la base de données
        await disconnectFromDatabase(); // Remplacez cette fonction par la fonction réelle pour se déconnecter de la base de données
    });
});






