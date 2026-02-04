const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

let validToken;

beforeAll(async () => {
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

  // Ajusta según la estructura real de tu respuesta
  validToken = res.body.data?.token || res.body.token;
  if (!validToken) {
    throw new Error(`No se pudo obtener token en /auth/login: ${JSON.stringify(res.body)}`);
  }
});

afterAll(async () => {
  await sequelize.close(); // 👈 cerrar conexión
});

describe('Admin Products API', () => {
  it('POST /products should fail without categoryId', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'Test Product', price: 10, stock: 5 });

    expect(res.statusCode).toBe(400);

    // Ajusta según el formato real de tu error
    expect(res.body.data?.message || res.body.message).toMatch(/categoryId/i);
  });
});
