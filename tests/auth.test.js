const { sequelize } = require('../models');
beforeAll(async () => {
  await sequelize.sync(); 
});


const request = require('supertest');
const app = require('../app');

describe('Auth endpoints', () => {
  it('debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        nombreCompleto: 'Test User',
        email: 'test@example.com',
        password: 'Test1234'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  it('debería iniciar sesión con credenciales válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test1234'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});

