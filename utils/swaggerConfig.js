import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notimail',
      version: '1.0.0',
      description: 'API Notimail pour la notification de courrier',
    },
  },
  apis: ['../routes/userRoutes.js'], 
};

const specs = swaggerJsdoc(options);


export { specs, swaggerUi };
