const request = require('supertest');
const app = require('../app');

describe('GET /ping', () => {
  it('should return 200 OK with empty body', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('');
  });
});

describe('GET /about', () => {
  it('should return 200 OK with correct JSON', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('nombreCompleto');
  });
});
