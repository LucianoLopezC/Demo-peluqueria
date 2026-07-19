const horarioLaboralServicio = require('../servicios/horarioLaboral.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');

const obtenerMio = manejadorAsincrono(async (req, res) => {
  const dias = await horarioLaboralServicio.listarPorProfesional(req.usuario.id);
  res.json(dias);
});

const actualizarMio = manejadorAsincrono(async (req, res) => {
  const dias = await horarioLaboralServicio.actualizarHorario(req.usuario.id, req.body.dias);
  res.json(dias);
});

module.exports = { obtenerMio, actualizarMio };
