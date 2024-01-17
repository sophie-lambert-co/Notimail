// test/app.test.js

//npm test -- --detectOpenHandles

// Lorsque vous faites Request(app), cela signifie que vous utilisez supertest pour envelopper votre application app dans un objet qui vous permet d'effectuer des requêtes HTTP sans avoir à lancer réellement le serveur. Cela rend les tests plus rapides et plus isolés, car ils s'exécutent dans un environnement de test sans nécessiter un serveur réel en cours d'exécution.

// La création de l'instance de votre application à l'aide de Request(app) est une partie cruciale de l'utilisation de supertest pour tester vos routes et vos endpoints sans nécessiter le démarrage du serveur réel. Cela permet de s'assurer que les tests sont bien isolés et ne dépendent pas de l'état réel du serveur en cours d'exécution.


// importe le module Request de la bibliothèque supertest. Cette bibliothèque est utilisée pour effectuer des requêtes HTTP dans les tests.
// importe l'objet app depuis le fichier serveur.js. Cet objet représente votre application Express.
import Request from "supertest";
import { app } from "../serveur";




export const hello = ()=> {
return 'hello, world'
}

describe('Tests pour les requètes de NOTIMAIL', () => {

  it("rend helloworld", () => {
    expect(hello()).toBe("hello, world")
})


});






