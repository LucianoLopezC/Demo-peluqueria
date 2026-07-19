const { Router } = require('express');
const rutasServicios = require('./servicios.rutas');
const rutasDisponibilidad = require('./disponibilidad.rutas');
const rutasAutenticacion = require('./autenticacion.rutas');
const rutasReservas = require('./reservas.rutas');
const rutasProfesionales = require('./profesionales.rutas');
const rutasPanel = require('./panel.rutas');

const router = Router();

router.use('/servicios', rutasServicios);
router.use('/disponibilidad', rutasDisponibilidad);
router.use('/autenticacion', rutasAutenticacion);
router.use('/reservas', rutasReservas);
router.use('/profesionales', rutasProfesionales);
router.use('/panel', rutasPanel);

module.exports = router;
