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
        url: 'https://p3-31898868-1-6ia2.onrender.com',
        description: 'Servidor en Render'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombreCompleto: { type: 'string', example: 'Daniel Pérez' },
            email: { type: 'string', example: 'daniel@example.com' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            nombre: { type: 'string', example: 'Vinilo Retro' },
            descripcion: { type: 'string', example: 'Edición limitada de los 80s' },
            precio: { type: 'number', example: 25.99 },
            categoriaId: { type: 'integer', example: 2 },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' }
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 2 },
            nombre: { type: 'string', example: 'Rock' }
          }
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            nombre: { type: 'string', example: 'Edición Especial' }
          }
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
