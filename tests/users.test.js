const { sequelize } = require('../models');
const request = require('supertest');
const app = require('../app');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app)
    .post('/auth/register')
    .send({
      nombreCompleto: 'Test User',
      email: 'test@example.com',
      password: 'Test1234'
    });

  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'test@example.com',
      password: 'Test1234'
    });

  console.log('LOGIN RESPONSE:', res.body);

  expect(res.statusCode).toBe(200);
  token = res.body.data.token;
});

describe('Users endpoints', () => {
  it('debería listar usuarios con token válido', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('debería rechazar acceso sin token', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });
});
