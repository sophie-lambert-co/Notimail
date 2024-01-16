// test/app.test.js


import Request from "supertest";
import { app } from "../serveur";
describe('Tests pour les requêtes GET et POST', () => {

    var test = "dsfk"
    // Test pour la requête GET
    it('GET /api/endpoint devrait retourner un statut 200', async () => {
        const response = await Request(app).get('/user');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('GET request successful');
    });

    // Test pour la requête POST
    it('POST /api/endpoint devrait retourner un statut 201', async () => {
        const postData = { data: 'example' };
        const response = await Request(app)
            .post('/api/endpoint')
            .send(postData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('POST request successful');
        expect(response.body.data).toEqual(postData);
    });
});