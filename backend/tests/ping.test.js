const request = require('supertest');
const app = require('../app');

let server;

beforeAll(() => {
  server = app.listen(0); // Puerto dinámico para evitar conflictos
});

afterAll(() => {
  server.close(); // Cierra el servidor Express
});

describe('Ping endpoint', () => {
  it('debería responder con 200 y cuerpo vacío', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });
});