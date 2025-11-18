const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API P3_31898868. Vinilos Retro', 
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de productos, categorías y etiquetas.',
    },
    servers: [
  {
    url: 'http://localhost:3000',
    description: 'Servidor local'
  },
  {
    url: 'https://p3-31898868-1-6ia2.onrender.com/api-docs',
    description: 'Servidor en Render'
  }
],
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // aquí Swagger buscará anotaciones en tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
