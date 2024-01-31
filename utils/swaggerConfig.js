/**
 * @file swaggerConfig.js
 * @description Configuration de Swagger pour la documentation de l'API Notimail.
 * @module swaggerConfig
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Options de configuration pour Swagger.
 * @typedef {Object} SwaggerOptions
 * @property {string} openapi - Version d'OpenAPI utilisée (3.0.0 dans ce cas).
 * @property {Object} info - Informations générales sur l'API.
 * @property {string} info.title - Titre de l'API.
 * @property {string} info.version - Version de l'API.
 * @property {string} info.description - Description de l'API.
 */

/**
 * Génère les spécifications Swagger à partir des options définies.
 * @type {SwaggerOptions}
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notimail',
      version: '1.0.0',
      description: 'API Notimail pour la notification de courrier',
    },
  },
  apis: ['../routes/userRoutes.js'], // Spécifie les fichiers à inclure dans la documentation Swagger
};

/**
 * Les spécifications Swagger générées.
 * @type {Object}
 * @property {string} specs.openapi - Version d'OpenAPI utilisée.
 * @property {Object} specs.info - Informations générales sur l'API.
 * @property {string} specs.info.title - Titre de l'API.
 * @property {string} specs.info.version - Version de l'API.
 * @property {string} specs.info.description - Description de l'API.
 */

const specs = swaggerJsdoc(options);

/**
 * Interface utilisateur Swagger (Swagger UI).
 * @type {Object}
 */
const swaggerUi = swaggerUi;

// Exporte les spécifications Swagger et l'interface utilisateur Swagger
export { specs, swaggerUi };
