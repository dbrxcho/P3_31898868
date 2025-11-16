const request = require('supertest');
const { sequelize } = require('../models'); // importa sequelize para sincronizar
const app = require('../app');

let validToken;

beforeAll(async () => {
  // Sincronizar la base de datos para que existan las tablas
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

  // Manejar caso de error
  if (!res.body.data || !res.body.data.token) {
    throw new Error('No se pudo obtener token en /auth/login');
  }

  validToken = res.body.data.token;
});

describe('Categories API', () => {
  it('GET /categories should return 200', async () => {
    const res = await request(app)
      .get('/categories')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
