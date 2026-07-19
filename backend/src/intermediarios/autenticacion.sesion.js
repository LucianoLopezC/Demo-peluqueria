const crypto = require('crypto');
const entorno = require('../configuracion/entorno');

const NOMBRE_COOKIE_SESION = 'sid';
const OPCIONES_COOKIE_SESION = {
  httpOnly: true,
  secure: entorno.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

// Solo ancla el CSRF de invitados; nunca se usa para autorización.
function asegurarSesionInvitado(req, res, next) {
  if (!req.cookies[NOMBRE_COOKIE_SESION]) {
    const idSesion = crypto.randomUUID();
    res.cookie(NOMBRE_COOKIE_SESION, idSesion, OPCIONES_COOKIE_SESION);
    req.idSesion = idSesion;
  } else {
    req.idSesion = req.cookies[NOMBRE_COOKIE_SESION];
  }

  next();
}

module.exports = { asegurarSesionInvitado, NOMBRE_COOKIE_SESION };
