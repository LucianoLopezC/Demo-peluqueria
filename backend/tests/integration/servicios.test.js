const request = require('supertest');
const app = require('../../src/aplicacion');
const prisma = require('../../src/configuracion/prisma');

describe('GET /api/servicios', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna 200 con un arreglo de servicios activos', async () => {
    const res = await request(app).get('/api/servicios');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('solo retorna servicios marcados como activos', async () => {
    const res = await request(app).get('/api/servicios');

    for (const servicio of res.body) {
      expect(servicio.activo).toBe(true);
    }
  });
});
