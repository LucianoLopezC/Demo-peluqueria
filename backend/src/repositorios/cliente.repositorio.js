const prisma = require('../configuracion/prisma');

function buscarPorTelefono(telefono) {
  return prisma.cliente.findFirst({ where: { telefono } });
}

function crear({ nombreCompleto, telefono, correo }) {
  return prisma.cliente.create({ data: { nombreCompleto, telefono, correo } });
}

function eliminarTodos() {
  return prisma.cliente.deleteMany({});
}

module.exports = { buscarPorTelefono, crear, eliminarTodos };
