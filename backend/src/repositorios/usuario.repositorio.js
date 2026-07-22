const prisma = require('../configuracion/prisma');

function buscarPorCorreo(correo) {
  return prisma.usuario.findUnique({ where: { correo } });
}

function buscarPorId(id) {
  return prisma.usuario.findUnique({ where: { id } });
}

function buscarProfesionalesActivos() {
  return prisma.usuario.findMany({
    where: { rol: 'PROFESIONAL', activo: true },
    select: { id: true, nombreCompleto: true, urlFoto: true, biografia: true },
    orderBy: { creadoEn: 'asc' },
  });
}

function buscarStaffActivo() {
  return prisma.usuario.findMany({ where: { activo: true }, select: { id: true } });
}

module.exports = {
  buscarPorCorreo,
  buscarPorId,
  buscarProfesionalesActivos,
  buscarStaffActivo,
};
