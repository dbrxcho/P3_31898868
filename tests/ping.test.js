const request = require('supertest');
const app = require('../app');

describe('Ping endpoint', () => {
  it('debería responder con 200 y cuerpo vacío', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });
});
