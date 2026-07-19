const request = require('supertest');
const app = require('../../src/aplicacion');
const prisma = require('../../src/configuracion/prisma');

describe('GET /api/reservas/token-csrf', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna un token csrf y establece las cookies de sesión + csrf', async () => {
    const res = await request(app).get('/api/reservas/token-csrf');

    expect(res.status).toBe(200);
    expect(res.body.tokenCsrf).toEqual(expect.any(String));

    const cookies = res.headers['set-cookie'].join(';');
    expect(cookies).toMatch(/sid=/);
    expect(cookies).toMatch(/tokenCsrf=/);
  });
});

describe('POST /api/reservas', () => {
  it('rechaza la request con 403 cuando no se envía token csrf', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        profesionalId: '11111111-1111-1111-1111-111111111111',
        servicioId: '22222222-2222-2222-2222-222222222222',
        horaInicio: '2026-08-01T10:00:00.000Z',
        cliente: { nombreCompleto: 'Cliente Demo', telefono: '+56911111111' },
      });

    expect(res.status).toBe(403);
  });

  it('rechaza la request con 400 cuando el body falla la validación del esquema', async () => {
    const agent = request.agent(app);
    const resCsrf = await agent.get('/api/reservas/token-csrf');
    const { tokenCsrf } = resCsrf.body;

    const res = await agent
      .post('/api/reservas')
      .set('x-token-csrf', tokenCsrf)
      .send({ profesionalId: 'no-es-un-uuid' });

    expect(res.status).toBe(400);
  });
});
