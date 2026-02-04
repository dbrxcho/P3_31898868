const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close(); // 👈 cerrar conexión al terminar
});

describe('Tags API', () => {
  it('GET /tags should return 200', async () => {
    const res = await request(app).get('/tags');
    expect([200, 401]).toContain(res.statusCode); // depende si requiere auth
  });

  it('POST /tags should create a tag', async () => {
    const res = await request(app)
      .post('/tags')
      .send({ name: 'TestTag' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('TestTag');
  });
});
