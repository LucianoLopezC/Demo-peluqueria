const ErrorApi = require('../utilidades/ErrorApi');

// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, next) {
  if (err instanceof ErrorApi) {
    return res.status(err.codigoEstado).json({ error: err.message, detalles: err.detalles });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = manejadorErrores;
