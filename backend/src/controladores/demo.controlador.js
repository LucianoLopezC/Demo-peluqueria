const demoServicio = require('../servicios/demo.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');

const reiniciar = manejadorAsincrono(async (req, res) => {
  await demoServicio.reiniciarDemo();
  res.json({ estado: 'ok' });
});

module.exports = { reiniciar };
