const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('Public Products API', () => {
  it('GET /public/products should return 200', async () => {
    const res = await request(app).get('/public/products/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Global Ping', () => {
  it('GET /ping should return 200', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
  });
});

