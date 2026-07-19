const reservasServicio = require('../servicios/reservas.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');

const listarMias = manejadorAsincrono(async (req, res) => {
  const reservas = await reservasServicio.listarProximasPorProfesional(req.usuario.id);
  res.json(reservas);
});

const cancelar = manejadorAsincrono(async (req, res) => {
  const reserva = await reservasServicio.cancelarReserva(req.usuario.id, req.params.id);
  res.json(reserva);
});

const reprogramar = manejadorAsincrono(async (req, res) => {
  const reserva = await reservasServicio.reprogramarReserva(
    req.usuario.id,
    req.params.id,
    req.body.nuevaHoraInicio,
  );
  res.json(reserva);
});

module.exports = { listarMias, cancelar, reprogramar };
