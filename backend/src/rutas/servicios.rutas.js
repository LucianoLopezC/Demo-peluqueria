const { Router } = require('express');
const serviciosControlador = require('../controladores/servicios.controlador');

const router = Router();

router.get('/', serviciosControlador.listarServicios);

module.exports = router;
