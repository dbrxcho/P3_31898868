const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API P3_31898868. Vinilos Retro',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de productos, categorías y etiquetas.'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local (base /api)'
      },
      {
        url: 'https://p3-31898868-1-6ia2.onrender.com/api',
        description: 'Servidor en Render (base /api)'
      },
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
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            status: { type: 'string', example: 'COMPLETED' },
            totalAmount: { type: 'number', example: 59.99 },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            orderId: { type: 'integer', example: 1 },
            productId: { type: 'integer', example: 10 },
            quantity: { type: 'integer', example: 2 },
            unitPrice: { type: 'number', example: 29.99 }
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
  apis: ['./routes/*.js'] // aquí Swagger buscará anotaciones en tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

// Debug log para verificar qué paths fueron parseadas por swagger-jsdoc
console.log('Swagger parsed paths:', Object.keys(swaggerSpec.paths || {}));

module.exports = swaggerSpec;
