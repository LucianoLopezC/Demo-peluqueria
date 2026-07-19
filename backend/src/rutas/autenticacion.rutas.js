const { Router } = require('express');
const autenticacionControlador = require('../controladores/autenticacion.controlador');
const validar = require('../intermediarios/validar');
const { limitadorReservas } = require('../intermediarios/limitadorSolicitudes');
const { esquemaInicioSesion } = require('../validadores/autenticacion.esquema');

const router = Router();

router.post(
  '/iniciar-sesion',
  limitadorReservas,
  validar(esquemaInicioSesion),
  autenticacionControlador.iniciarSesion,
);
router.post('/renovar', limitadorReservas, autenticacionControlador.renovar);
router.post('/cerrar-sesion', autenticacionControlador.cerrarSesion);

// Google OAuth: no implementado en esta fase (YAGNI). Punto de extensión futuro:
// router.post('/google', autenticacionControlador.iniciarSesionGoogle);

module.exports = router;
