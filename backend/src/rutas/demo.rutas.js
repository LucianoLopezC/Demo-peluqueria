const { Router } = require('express');
const entorno = require('../configuracion/entorno');
const demoControlador = require('../controladores/demo.controlador');
const ErrorApi = require('../utilidades/ErrorApi');

const router = Router();

// Vercel Cron Jobs solo puede invocar con GET, por eso este endpoint
// destructivo usa GET en vez de POST/DELETE (excepción forzada por la
// plataforma, no una elección de diseño). Se protege comparando el header
// Authorization contra CRON_SECRET, que Vercel agrega solo en cada invocación
// programada.
router.get('/reiniciar', (req, res, next) => {
  const encabezadoEsperado = `Bearer ${entorno.CRON_SECRET}`;
  if (!entorno.CRON_SECRET || req.get('authorization') !== encabezadoEsperado) {
    return next(new ErrorApi(401, 'No autorizado'));
  }
  return demoControlador.reiniciar(req, res, next);
});

module.exports = router;
