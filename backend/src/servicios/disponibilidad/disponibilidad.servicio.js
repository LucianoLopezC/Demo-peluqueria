const servicioRepositorio = require('../../repositorios/servicio.repositorio');
const horarioLaboralRepositorio = require('../../repositorios/horarioLaboral.repositorio');
const reservaRepositorio = require('../../repositorios/reserva.repositorio');
const {
  generarIntervalosDisponibles,
  validarIntervalo,
  calcularFinIntervalo,
} = require('./disponibilidad.reglas');
const cacheServicio = require('../cache.servicio');
const ErrorApi = require('../../utilidades/ErrorApi');

const PASO_MINUTOS = 30;

const MENSAJES_MOTIVO = {
  PASADO: 'La hora seleccionada ya pasó',
  FUERA_DE_HORARIO: 'El profesional no trabaja en la hora seleccionada',
  CONFLICTO: 'La hora seleccionada ya no está disponible',
};

function limitesDia(fecha) {
  const inicioDia = new Date(fecha);
  inicioDia.setHours(0, 0, 0, 0);
  const finDia = new Date(inicioDia);
  finDia.setDate(finDia.getDate() + 1);
  return { inicioDia, finDia };
}

async function obtenerIntervalosDisponibles({ profesionalId, servicioId, fecha }) {
  const servicio = await servicioRepositorio.buscarPorId(servicioId);
  if (!servicio) {
    throw new ErrorApi(404, 'Servicio no encontrado');
  }

  const { inicioDia, finDia } = limitesDia(fecha);

  const enCache = await cacheServicio.obtenerDisponibilidadCache(
    profesionalId,
    servicioId,
    inicioDia,
  );
  if (enCache) {
    return enCache;
  }

  const diaSemana = inicioDia.getDay();

  const [horarioLaboralDelDia, reservasExistentes] = await Promise.all([
    horarioLaboralRepositorio.buscarPorProfesionalYDia(profesionalId, diaSemana),
    reservaRepositorio.buscarPorProfesionalYDia(profesionalId, inicioDia, finDia),
  ]);

  const intervalos = generarIntervalosDisponibles({
    fecha: inicioDia,
    duracionMinutos: servicio.duracionMinutos,
    horarioLaboralDelDia,
    reservasExistentes,
    ahora: new Date(),
    pasoMinutos: PASO_MINUTOS,
  });

  await cacheServicio.guardarDisponibilidadCache(profesionalId, servicioId, inicioDia, intervalos);

  return intervalos;
}

async function verificarIntervaloValido({
  profesionalId,
  servicioId,
  inicioIntervalo,
  idReservaExcluida,
}) {
  const servicio = await servicioRepositorio.buscarPorId(servicioId);
  if (!servicio) {
    throw new ErrorApi(404, 'Servicio no encontrado');
  }

  const { inicioDia, finDia } = limitesDia(inicioIntervalo);
  const diaSemana = inicioDia.getDay();

  const [horarioLaboralDelDia, reservasExistentes] = await Promise.all([
    horarioLaboralRepositorio.buscarPorProfesionalYDia(profesionalId, diaSemana),
    reservaRepositorio.buscarPorProfesionalYDia(
      profesionalId,
      inicioDia,
      finDia,
      idReservaExcluida,
    ),
  ]);

  const resultado = validarIntervalo({
    inicioIntervalo,
    duracionMinutos: servicio.duracionMinutos,
    ahora: new Date(),
    horarioLaboralDelDia,
    reservasExistentes,
  });

  if (!resultado.valido) {
    throw new ErrorApi(409, MENSAJES_MOTIVO[resultado.motivo] || 'La hora no está disponible', {
      motivo: resultado.motivo,
    });
  }

  return {
    servicio,
    finIntervalo: calcularFinIntervalo(inicioIntervalo, servicio.duracionMinutos),
  };
}

module.exports = { obtenerIntervalosDisponibles, verificarIntervaloValido };
