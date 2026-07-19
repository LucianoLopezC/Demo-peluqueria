const prisma = require('../configuracion/prisma');

function crear({ hashToken, usuarioId, expiraEn }) {
  return prisma.tokenRefresco.create({ data: { hashToken, usuarioId, expiraEn } });
}

function buscarValidoPorHash(hashToken) {
  return prisma.tokenRefresco.findFirst({
    where: { hashToken, revocado: false, expiraEn: { gt: new Date() } },
  });
}

function revocar(id) {
  return prisma.tokenRefresco.update({ where: { id }, data: { revocado: true } });
}

module.exports = { crear, buscarValidoPorHash, revocar };
