const prisma = require('../configuracion/prisma');

function buscarPorTelefono(telefono) {
  return prisma.cliente.findFirst({ where: { telefono } });
}

function crear({ nombreCompleto, telefono, correo }) {
  return prisma.cliente.create({ data: { nombreCompleto, telefono, correo } });
}

module.exports = { buscarPorTelefono, crear };
