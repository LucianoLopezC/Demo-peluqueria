const reservasServicio = require('../servicios/reservas.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');
const { emitirTokenCsrf } = require('../intermediarios/csrf');

const obtenerTokenCsrf = manejadorAsincrono(async (req, res) => {
  const tokenCsrf = emitirTokenCsrf(req, res);
  res.json({ tokenCsrf });
});

const crearReserva = manejadorAsincrono(async (req, res) => {
  const reserva = await reservasServicio.crearReserva(req.body);
  res.status(201).json(reserva);
});

module.exports = { obtenerTokenCsrf, crearReserva };
