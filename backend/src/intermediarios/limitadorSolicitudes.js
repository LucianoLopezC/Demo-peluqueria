const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const redis = require('../configuracion/redis');

// Store de express-rate-limit respaldado por el cliente REST de Redis de
// Upstash. Falla abierto (permite la request) ante errores de Redis, para que
// un Redis inalcanzable/no configurado nunca convierta el rate limiting en una
// caída dura. Los nombres de método (init/increment/decrement/resetKey) los
// exige la interfaz Store de express-rate-limit, no son elección nuestra.
class AlmacenLimiteUpstash {
  init(opciones) {
    this.ventanaMs = opciones.windowMs;
  }

  async increment(clave) {
    try {
      const totalIntentos = await redis.incr(clave);
      if (totalIntentos === 1) {
        await redis.pexpire(clave, this.ventanaMs);
      }
      return { totalHits: totalIntentos, resetTime: new Date(Date.now() + this.ventanaMs) };
    } catch (err) {
      console.error('Error en el store de rate limit, se permite la request', err.message);
      return { totalHits: 1, resetTime: new Date(Date.now() + this.ventanaMs) };
    }
  }

  async decrement(clave) {
    try {
      await redis.decr(clave);
    } catch (_err) {
      // best-effort únicamente
    }
  }

  async resetKey(clave) {
    try {
      await redis.del(clave);
    } catch (_err) {
      // best-effort únicamente
    }
  }
}

const limitadorGeneral = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: new AlmacenLimiteUpstash(),
});

// Límite más estricto para el endpoint de reservas: anti-spam / anti-doble-reserva.
const limitadorReservas = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new AlmacenLimiteUpstash(),
  keyGenerator: (req) => `reserva:${ipKeyGenerator(req.ip)}`,
  message: { error: 'Demasiados intentos de reserva, intenta de nuevo en un minuto' },
});

module.exports = { limitadorGeneral, limitadorReservas, AlmacenLimiteUpstash };
