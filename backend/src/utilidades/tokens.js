const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const entorno = require('../configuracion/entorno');

const TTL_TOKEN_ACCESO = '15m';
const TTL_TOKEN_REFRESCO = '7d';
const TTL_TOKEN_REFRESCO_MS = 7 * 24 * 60 * 60 * 1000;

function firmarTokenAcceso({ id, rol }) {
  return jwt.sign({ sub: id, rol }, entorno.SECRETO_TOKEN_ACCESO, { expiresIn: TTL_TOKEN_ACCESO });
}

function firmarTokenRefresco({ id }) {
  return jwt.sign({ sub: id }, entorno.SECRETO_TOKEN_REFRESCO, { expiresIn: TTL_TOKEN_REFRESCO });
}

function verificarTokenAcceso(token) {
  return jwt.verify(token, entorno.SECRETO_TOKEN_ACCESO);
}

function verificarTokenRefresco(token) {
  return jwt.verify(token, entorno.SECRETO_TOKEN_REFRESCO);
}

function hashearToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  firmarTokenAcceso,
  firmarTokenRefresco,
  verificarTokenAcceso,
  verificarTokenRefresco,
  hashearToken,
  TTL_TOKEN_REFRESCO_MS,
};
