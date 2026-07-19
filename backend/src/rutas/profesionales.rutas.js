const { Router } = require('express');
const profesionalesControlador = require('../controladores/profesionales.controlador');

const router = Router();

router.get('/', profesionalesControlador.listarProfesionales);

module.exports = router;
