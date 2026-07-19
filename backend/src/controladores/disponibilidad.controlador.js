const disponibilidadServicio = require('../servicios/disponibilidad/disponibilidad.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');
const ErrorApi = require('../utilidades/ErrorApi');
const { analizarFechaLocal } = require('../utilidades/fechas');

const obtenerIntervalosDisponibles = manejadorAsincrono(async (req, res) => {
  const { profesionalId } = req.params;
  const { servicioId, fecha } = req.query;

  if (!servicioId || !fecha) {
    throw new ErrorApi(400, 'Los parámetros servicioId y fecha son requeridos');
  }

  const fechaAnalizada = analizarFechaLocal(fecha);
  if (Number.isNaN(fechaAnalizada.getTime())) {
    throw new ErrorApi(400, 'Fecha inválida');
  }

  const intervalos = await disponibilidadServicio.obtenerIntervalosDisponibles({
    profesionalId,
    servicioId,
    fecha: fechaAnalizada,
  });

  res.json({ intervalos });
});

module.exports = { obtenerIntervalosDisponibles };
