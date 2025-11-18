const { sequelize } = require('../models');
const request = require('supertest');
const app = require('../app');

let server;

beforeAll(async () => {
  server = app.listen(0);
  process.env.JWT_SECRET = 'secret';
  // sincroniza la base en memoria
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

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
    // registrar primero al usuario
    await request(app)
      .post('/auth/register')
      .send({
        nombreCompleto: 'Login User',
        email: 'login@example.com',
        password: 'Login1234'
      });

    // luego intentar login
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'login@example.com',
        password: 'Login1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
  });
});
