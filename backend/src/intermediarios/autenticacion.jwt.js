const { verificarTokenAcceso } = require('../utilidades/tokens');
const ErrorApi = require('../utilidades/ErrorApi');

function autenticacionJwt(req, res, next) {
  const cabeceraAuth = req.headers.authorization;

  if (!cabeceraAuth || !cabeceraAuth.startsWith('Bearer ')) {
    return next(new ErrorApi(401, 'Falta el token de acceso'));
  }

  const token = cabeceraAuth.slice('Bearer '.length);

  try {
    const cargaUtil = verificarTokenAcceso(token);
    req.usuario = { id: cargaUtil.sub, rol: cargaUtil.rol };
    return next();
  } catch (_err) {
    return next(new ErrorApi(401, 'Token de acceso inválido o expirado'));
  }
}

module.exports = autenticacionJwt;
