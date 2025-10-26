const { sequelize } = require('../models');
const request = require('supertest');
const app = require('../app');

let token;
let server;

beforeAll(async () => {
  // Levanta el servidor en un puerto dinámico
  server = app.listen(0);

  // Sincroniza la base de datos en modo limpio
  await sequelize.sync({ force: true });

  // Registro de usuario de prueba
  await request(app)
    .post('/auth/register')
    .send({
      nombreCompleto: 'Test User',
      email: 'test@example.com',
      password: 'Test1234'
    });

  // Login para obtener el token
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

afterAll(async () => {
  // Cierra la conexión a la base de datos y el servidor
  await sequelize.close();
  server.close();
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
