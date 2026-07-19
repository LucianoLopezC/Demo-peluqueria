const request = require('supertest');
const app = require('../../src/aplicacion');
const prisma = require('../../src/configuracion/prisma');

describe('GET /api/disponibilidad/:profesionalId', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna 400 cuando faltan los parámetros servicioId o fecha', async () => {
    const res = await request(app).get('/api/disponibilidad/algun-profesional-id');
    expect(res.status).toBe(400);
  });

  it('retorna 400 cuando la fecha no es válida', async () => {
    const res = await request(app)
      .get('/api/disponibilidad/algun-profesional-id')
      .query({ servicioId: 'algun-servicio-id', fecha: 'no-es-una-fecha' });
    expect(res.status).toBe(400);
  });

  it('retorna 404 cuando el servicio no existe', async () => {
    const res = await request(app)
      .get('/api/disponibilidad/algun-profesional-id')
      .query({ servicioId: 'servicio-inexistente-id', fecha: '2026-07-20' });
    expect(res.status).toBe(404);
  });
});
