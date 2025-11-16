const request = require('supertest');
const { sequelize } = require('../models'); // importa sequelize
const app = require('../app');

let validToken;

beforeAll(async () => {
  // Crear todas las tablas antes de los tests
  await sequelize.sync({ force: true });

  // Registrar usuario admin
  await request(app)
    .post('/auth/register')
    .send({
      nombreCompleto: 'Admin Test',
      email: 'admin@example.com',
      password: 'adminpass'
    });

  // Login para obtener token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: 'adminpass' });

  if (!res.body.data || !res.body.data.token) {
    throw new Error('No se pudo obtener token en /auth/login');
  }

  validToken = res.body.data.token;
});

describe('Admin Products API', () => {
  it('POST /products should fail without categoryId', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Test Product', price: 10, stock: 5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.data.message).toMatch(/categoryId es obligatorio/);
  });
});
