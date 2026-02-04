const request = require('supertest');
const app = require('../app');

describe('Orders - acceso', () => {
  it('niega acceso sin token', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(401);
  });
});
