const { Router } = require('express');
const disponibilidadControlador = require('../controladores/disponibilidad.controlador');

const router = Router();

router.get('/:profesionalId', disponibilidadControlador.obtenerIntervalosDisponibles);

module.exports = router;
