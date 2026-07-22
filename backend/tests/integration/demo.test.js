const request = require('supertest');
const app = require('../../src/aplicacion');

describe('GET /api/demo/reiniciar', () => {
  it('retorna 401 sin el header Authorization correcto', async () => {
    const res = await request(app).get('/api/demo/reiniciar');
    expect(res.status).toBe(401);
  });

  it('retorna 401 con un secreto incorrecto', async () => {
    const res = await request(app)
      .get('/api/demo/reiniciar')
      .set('Authorization', 'Bearer secreto-incorrecto');
    expect(res.status).toBe(401);
  });
});
