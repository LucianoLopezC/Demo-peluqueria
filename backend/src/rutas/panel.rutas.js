const { Router } = require('express');
const autenticacionJwt = require('../intermediarios/autenticacion.jwt');
const validar = require('../intermediarios/validar');
const panelReservasControlador = require('../controladores/panelReservas.controlador');
const panelHorarioLaboralControlador = require('../controladores/panelHorarioLaboral.controlador');
const {
  esquemaReprogramarReserva,
  esquemaCancelarReserva,
} = require('../validadores/reserva.esquema');
const { esquemaActualizarHorarioLaboral } = require('../validadores/horarioLaboral.esquema');

const router = Router();

router.use(autenticacionJwt);

router.get('/reservas', panelReservasControlador.listarMias);
router.patch(
  '/reservas/:id/cancelar',
  validar(esquemaCancelarReserva),
  panelReservasControlador.cancelar,
);
router.patch(
  '/reservas/:id/reprogramar',
  validar(esquemaReprogramarReserva),
  panelReservasControlador.reprogramar,
);

router.get('/horario-laboral', panelHorarioLaboralControlador.obtenerMio);
router.put(
  '/horario-laboral',
  validar(esquemaActualizarHorarioLaboral),
  panelHorarioLaboralControlador.actualizarMio,
);

module.exports = router;
