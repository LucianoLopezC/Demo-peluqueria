const prisma = require('../configuracion/prisma');

function buscarPorProfesionalYDia(profesionalId, inicioDia, finDia, idExcluido = null) {
  return prisma.reserva.findMany({
    where: {
      profesionalId,
      horaInicio: { gte: inicioDia, lt: finDia },
      ...(idExcluido ? { id: { not: idExcluido } } : {}),
    },
  });
}

function crear({ profesionalId, servicioId, clienteId, horaInicio, horaFin, notas }) {
  return prisma.reserva.create({
    data: { profesionalId, servicioId, clienteId, horaInicio, horaFin, notas },
  });
}

function buscarPorId(id) {
  return prisma.reserva.findUnique({ where: { id }, include: { cliente: true, servicio: true } });
}

function buscarProximasPorProfesional(profesionalId, desde) {
  return prisma.reserva.findMany({
    where: {
      profesionalId,
      horaInicio: { gte: desde },
      estado: { not: 'CANCELADA' },
    },
    include: { cliente: true, servicio: true },
    orderBy: { horaInicio: 'asc' },
  });
}

function actualizarEstado(id, estado) {
  return prisma.reserva.update({ where: { id }, data: { estado } });
}

function reprogramar(id, { horaInicio, horaFin }) {
  return prisma.reserva.update({ where: { id }, data: { horaInicio, horaFin } });
}

function eliminarTodas() {
  return prisma.reserva.deleteMany({});
}

module.exports = {
  buscarPorProfesionalYDia,
  crear,
  buscarPorId,
  buscarProximasPorProfesional,
  actualizarEstado,
  reprogramar,
  eliminarTodas,
};
