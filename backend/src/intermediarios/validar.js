const ErrorApi = require('../utilidades/ErrorApi');

function validar(esquema) {
  return (req, res, next) => {
    const resultado = esquema.safeParse({ body: req.body, query: req.query, params: req.params });

    if (!resultado.success) {
      return next(new ErrorApi(400, 'Error de validación', resultado.error.flatten()));
    }

    if (resultado.data.body) req.body = resultado.data.body;
    if (resultado.data.query) req.query = resultado.data.query;
    if (resultado.data.params) req.params = resultado.data.params;

    return next();
  };
}

module.exports = validar;
