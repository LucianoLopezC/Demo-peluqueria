const prisma = require('../configuracion/prisma');

function buscarPorProfesionalYDia(profesionalId, diaSemana) {
  return prisma.horarioLaboral.findUnique({
    where: { profesionalId_diaSemana: { profesionalId, diaSemana } },
  });
}

function buscarTodosPorProfesional(profesionalId) {
  return prisma.horarioLaboral.findMany({
    where: { profesionalId },
    orderBy: { diaSemana: 'asc' },
  });
}

function guardarDia(profesionalId, diaSemana, datos) {
  return prisma.horarioLaboral.upsert({
    where: { profesionalId_diaSemana: { profesionalId, diaSemana } },
    update: datos,
    create: { profesionalId, diaSemana, ...datos },
  });
}

function eliminarTodos() {
  return prisma.horarioLaboral.deleteMany({});
}

module.exports = {
  buscarPorProfesionalYDia,
  buscarTodosPorProfesional,
  guardarDia,
  eliminarTodos,
};
