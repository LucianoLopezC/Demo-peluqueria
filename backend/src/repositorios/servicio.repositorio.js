const prisma = require('../configuracion/prisma');

function buscarTodosActivos() {
  return prisma.servicio.findMany({
    where: { activo: true },
    orderBy: { creadoEn: 'asc' },
  });
}

function buscarPorId(id) {
  return prisma.servicio.findUnique({ where: { id } });
}

module.exports = { buscarTodosActivos, buscarPorId };
