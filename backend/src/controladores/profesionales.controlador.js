const profesionalesServicio = require('../servicios/profesionales.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');

const listarProfesionales = manejadorAsincrono(async (req, res) => {
  const profesionales = await profesionalesServicio.listarProfesionales();
  res.json(profesionales);
});

module.exports = { listarProfesionales };
