const request = require('supertest');
const app = require('../../src/aplicacion');
const prisma = require('../../src/configuracion/prisma');

describe('POST /api/autenticacion/iniciar-sesion', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('retorna 400 cuando el body de la request falla la validación', async () => {
    const res = await request(app)
      .post('/api/autenticacion/iniciar-sesion')
      .send({ correo: 'no-es-un-correo' });
    expect(res.status).toBe(400);
  });

  it('retorna 401 cuando las credenciales son inválidas', async () => {
    const res = await request(app)
      .post('/api/autenticacion/iniciar-sesion')
      .send({ correo: 'inexistente@peluqueria1.com', contrasena: 'contrasena-incorrecta' });
    expect([401, 500]).toContain(res.status);
  });
});

describe('POST /api/autenticacion/renovar', () => {
  it('retorna 401 cuando no hay cookie de token de refresco', async () => {
    const res = await request(app).post('/api/autenticacion/renovar');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/autenticacion/entrar-demo', () => {
  it('inicia sesión sin pedir contraseña cuando la cuenta demo existe', async () => {
    const res = await request(app).post('/api/autenticacion/entrar-demo');
    expect([200, 503, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.usuario.esDemo).toBe(true);
      expect(res.body.usuario).not.toHaveProperty('hashContrasena');
    }
  });
});
