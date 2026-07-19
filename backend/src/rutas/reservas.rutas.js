const { Router } = require('express');
const reservasControlador = require('../controladores/reservas.controlador');
const { asegurarSesionInvitado } = require('../intermediarios/autenticacion.sesion');
const { requerirCsrf } = require('../intermediarios/csrf');
const { limitadorReservas } = require('../intermediarios/limitadorSolicitudes');
const validar = require('../intermediarios/validar');
const sanitizarCampos = require('../intermediarios/sanitizar');
const { esquemaCrearReserva } = require('../validadores/reserva.esquema');

const router = Router();

router.get('/token-csrf', asegurarSesionInvitado, reservasControlador.obtenerTokenCsrf);

router.post(
  '/',
  limitadorReservas,
  asegurarSesionInvitado,
  requerirCsrf,
  validar(esquemaCrearReserva),
  sanitizarCampos(['notas', 'cliente.nombreCompleto']),
  reservasControlador.crearReserva,
);

module.exports = router;
