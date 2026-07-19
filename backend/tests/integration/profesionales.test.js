const request = require('supertest');
const app = require('../../src/aplicacion');
const prisma = require('../../src/configuracion/prisma');

describe('GET /api/profesionales', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna 200 con un arreglo', async () => {
    const res = await request(app).get('/api/profesionales');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('nunca expone hashContrasena ni correo en el payload público', async () => {
    const res = await request(app).get('/api/profesionales');
    for (const profesional of res.body) {
      expect(profesional.hashContrasena).toBeUndefined();
      expect(profesional.correo).toBeUndefined();
    }
  });
});
