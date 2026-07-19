const serviciosServicio = require('../servicios/servicios.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');

const listarServicios = manejadorAsincrono(async (req, res) => {
  const servicios = await serviciosServicio.listarServicios();
  res.json(servicios);
});

module.exports = { listarServicios };
