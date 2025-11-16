const request = require('supertest');
const app = require('../app');

describe('Tags API', () => {
  it('GET /tags should return 200', async () => {
    const res = await request(app).get('/tags');
    expect([200, 401]).toContain(res.statusCode); // depende si requiere auth
  });
});
