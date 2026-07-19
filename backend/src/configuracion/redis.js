const { Redis } = require('@upstash/redis');
const entorno = require('./entorno');

const redis = new Redis({
  url: entorno.URL_REST_UPSTASH_REDIS || 'http://localhost',
  token: entorno.TOKEN_REST_UPSTASH_REDIS || 'placeholder',
  // Las llamadas de cache/rate-limit fallan de forma segura ante un error (ver
  // cache.servicio.js y limitadorSolicitudes.js), así que reintentar solo
  // ralentiza cada request sin ningún beneficio - mejor fallar rápido,
  // especialmente antes de tener las credenciales de Upstash configuradas.
  retry: { retries: 0 },
});

module.exports = redis;
