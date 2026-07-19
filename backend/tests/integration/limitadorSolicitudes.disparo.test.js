jest.mock('../../src/configuracion/redis', () => ({
  incr: jest.fn(),
  decr: jest.fn(),
  del: jest.fn(),
  pexpire: jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const redis = require('../../src/configuracion/redis');
const { rateLimit } = require('express-rate-limit');
const { AlmacenLimiteUpstash } = require('../../src/intermediarios/limitadorSolicitudes');

describe('el rate limiter dispara 429 al superar el límite', () => {
  it('permite requests bajo el límite y bloquea la que lo excede', async () => {
    let intentos = 0;
    redis.incr.mockImplementation(() => Promise.resolve(++intentos));

    const app = express();
    app.use(
      rateLimit({
        windowMs: 60_000,
        limit: 2,
        standardHeaders: true,
        legacyHeaders: false,
        store: new AlmacenLimiteUpstash(),
      }),
    );
    app.get('/prueba', (req, res) => res.json({ ok: true }));

    const primera = await request(app).get('/prueba');
    const segunda = await request(app).get('/prueba');
    const tercera = await request(app).get('/prueba');

    expect(primera.status).toBe(200);
    expect(segunda.status).toBe(200);
    expect(tercera.status).toBe(429);
  });
});
