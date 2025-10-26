const { sequelize } = require('../models');
const request = require('supertest');
const app = require('../app');

let server;

beforeAll(async () => {
  // Levanta el servidor en un puerto dinámico
  server = app.listen(0);

  // Sincroniza la base de datos
  await sequelize.sync();
});

afterAll(async () => {
  // Cierra la conexión a la base de datos y el servidor
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
