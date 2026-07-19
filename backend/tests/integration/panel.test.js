const request = require('supertest');
const app = require('../../src/aplicacion');
const prisma = require('../../src/configuracion/prisma');

describe('Las rutas del panel requieren un token de acceso válido', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/panel/reservas retorna 401 sin token', async () => {
    const res = await request(app).get('/api/panel/reservas');
    expect(res.status).toBe(401);
  });

  it('GET /api/panel/horario-laboral retorna 401 sin token', async () => {
    const res = await request(app).get('/api/panel/horario-laboral');
    expect(res.status).toBe(401);
  });

  it('PATCH /api/panel/reservas/:id/cancelar retorna 401 sin token', async () => {
    const res = await request(app).patch(
      '/api/panel/reservas/11111111-1111-1111-1111-111111111111/cancelar',
    );
    expect(res.status).toBe(401);
  });

  it('rechaza un bearer token inválido', async () => {
    const res = await request(app)
      .get('/api/panel/reservas')
      .set('Authorization', 'Bearer no-es-un-token-real');
    expect(res.status).toBe(401);
  });
});
