const crypto = require('crypto');
const entorno = require('../configuracion/entorno');
const ErrorApi = require('../utilidades/ErrorApi');

const NOMBRE_COOKIE_CSRF = 'tokenCsrf';
const NOMBRE_CABECERA_CSRF = 'x-token-csrf';
const OPCIONES_COOKIE_CSRF = {
  httpOnly: false, // debe poder leerse desde JS del frontend para reenviarlo en la cabecera
  secure: entorno.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

function emitirTokenCsrf(req, res) {
  const tokenCsrf = crypto.randomBytes(32).toString('hex');
  res.cookie(NOMBRE_COOKIE_CSRF, tokenCsrf, OPCIONES_COOKIE_CSRF);
  return tokenCsrf;
}

// Patrón double-submit-cookie: sin estado en servidor, compara cookie vs cabecera.
function requerirCsrf(req, res, next) {
  const tokenCookie = req.cookies[NOMBRE_COOKIE_CSRF];
  const tokenCabecera = req.headers[NOMBRE_CABECERA_CSRF];

  if (!tokenCookie || !tokenCabecera || tokenCookie !== tokenCabecera) {
    return next(new ErrorApi(403, 'Token CSRF inválido o faltante'));
  }

  return next();
}

module.exports = { emitirTokenCsrf, requerirCsrf, NOMBRE_COOKIE_CSRF, NOMBRE_CABECERA_CSRF };
