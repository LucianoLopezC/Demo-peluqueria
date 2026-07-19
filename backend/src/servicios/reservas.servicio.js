const clienteRepositorio = require('../repositorios/cliente.repositorio');
const reservaRepositorio = require('../repositorios/reserva.repositorio');
const servicioRepositorio = require('../repositorios/servicio.repositorio');
const disponibilidadServicio = require('./disponibilidad/disponibilidad.servicio');
const cacheServicio = require('./cache.servicio');
const registroActividadServicio = require('./registroActividad.servicio');
const ErrorApi = require('../utilidades/ErrorApi');

// Una reserva de cualquier servicio puede cambiar los intervalos que calzan
// para los demás servicios de ese profesional/día, así que se invalidan
// todos, no solo el que se acaba de reservar.
async function invalidarDisponibilidadDelDia(profesionalId, inicioIntervalo) {
  const serviciosActivos = await servicioRepositorio.buscarTodosActivos();
  await Promise.all(
    serviciosActivos.map((servicio) =>
      cacheServicio.invalidarDisponibilidad(profesionalId, servicio.id, inicioIntervalo),
    ),
  );
}

async function buscarOCrearCliente({ nombreCompleto, telefono, correo }) {
  const existente = await clienteRepositorio.buscarPorTelefono(telefono);
  if (existente) return existente;
  return clienteRepositorio.crear({ nombreCompleto, telefono, correo });
}

async function crearReserva({ profesionalId, servicioId, horaInicio, notas, cliente }) {
  const inicioIntervalo = new Date(horaInicio);
  if (Number.isNaN(inicioIntervalo.getTime())) {
    throw new ErrorApi(400, 'horaInicio inválida');
  }

  const { finIntervalo } = await disponibilidadServicio.verificarIntervaloValido({
    profesionalId,
    servicioId,
    inicioIntervalo,
  });

  const clienteRegistrado = await buscarOCrearCliente(cliente);

  const reserva = await reservaRepositorio.crear({
    profesionalId,
    servicioId,
    clienteId: clienteRegistrado.id,
    horaInicio: inicioIntervalo,
    horaFin: finIntervalo,
    notas,
  });

  invalidarDisponibilidadDelDia(profesionalId, inicioIntervalo).catch((err) =>
    console.error('No se pudo invalidar el cache de disponibilidad', err.message),
  );

  registroActividadServicio
    .registrarActividad({
      actorId: clienteRegistrado.id,
      rolActor: 'INVITADO',
      accion: 'RESERVA_CREADA',
      objetivoId: reserva.id,
      metadatos: { profesionalId, servicioId },
    })
    .catch(() => {});

  registroActividadServicio
    .registrarNotificacion({
      reservaId: reserva.id,
      clienteId: clienteRegistrado.id,
      profesionalId,
      tipo: 'CONFIRMACION',
      canal: 'CORREO',
      estado: 'ENVIADO',
      datos: { horaInicio: inicioIntervalo, servicioId },
    })
    .catch(() => {});

  return reserva;
}

async function listarProximasPorProfesional(profesionalId) {
  return reservaRepositorio.buscarProximasPorProfesional(profesionalId, new Date());
}

async function obtenerReservaPropia(profesionalId, reservaId) {
  const reserva = await reservaRepositorio.buscarPorId(reservaId);
  if (!reserva || reserva.profesionalId !== profesionalId) {
    throw new ErrorApi(404, 'Reserva no encontrada');
  }
  return reserva;
}

async function cancelarReserva(profesionalId, reservaId) {
  const reserva = await obtenerReservaPropia(profesionalId, reservaId);

  if (reserva.estado === 'CANCELADA') {
    throw new ErrorApi(409, 'La reserva ya está cancelada');
  }

  const actualizada = await reservaRepositorio.actualizarEstado(reservaId, 'CANCELADA');

  invalidarDisponibilidadDelDia(profesionalId, reserva.horaInicio).catch((err) =>
    console.error('No se pudo invalidar el cache de disponibilidad', err.message),
  );

  registroActividadServicio
    .registrarActividad({
      actorId: profesionalId,
      rolActor: 'PROFESIONAL',
      accion: 'RESERVA_CANCELADA',
      objetivoId: reservaId,
      metadatos: {},
    })
    .catch(() => {});

  return actualizada;
}

async function reprogramarReserva(profesionalId, reservaId, nuevaHoraInicio) {
  const reserva = await obtenerReservaPropia(profesionalId, reservaId);

  if (reserva.estado === 'CANCELADA') {
    throw new ErrorApi(409, 'No se puede reprogramar una reserva cancelada');
  }

  const inicioIntervalo = new Date(nuevaHoraInicio);
  if (Number.isNaN(inicioIntervalo.getTime())) {
    throw new ErrorApi(400, 'horaInicio inválida');
  }

  const { finIntervalo } = await disponibilidadServicio.verificarIntervaloValido({
    profesionalId,
    servicioId: reserva.servicioId,
    inicioIntervalo,
    idReservaExcluida: reservaId,
  });

  const actualizada = await reservaRepositorio.reprogramar(reservaId, {
    horaInicio: inicioIntervalo,
    horaFin: finIntervalo,
  });

  invalidarDisponibilidadDelDia(profesionalId, reserva.horaInicio).catch(() => {});
  invalidarDisponibilidadDelDia(profesionalId, inicioIntervalo).catch(() => {});

  registroActividadServicio
    .registrarActividad({
      actorId: profesionalId,
      rolActor: 'PROFESIONAL',
      accion: 'RESERVA_REPROGRAMADA',
      objetivoId: reservaId,
      metadatos: { nuevaHoraInicio: inicioIntervalo },
    })
    .catch(() => {});

  return actualizada;
}

module.exports = {
  crearReserva,
  listarProximasPorProfesional,
  cancelarReserva,
  reprogramarReserva,
};
