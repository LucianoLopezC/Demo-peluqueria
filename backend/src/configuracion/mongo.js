const { MongoClient } = require('mongodb');
const entorno = require('./entorno');

let promesaBd = null;

function obtenerBd() {
  if (!entorno.URI_MONGODB) {
    return Promise.reject(new Error('URI_MONGODB no está configurada'));
  }

  if (!promesaBd) {
    const cliente = new MongoClient(entorno.URI_MONGODB);
    promesaBd = cliente.connect().then(() => cliente.db());
  }

  return promesaBd;
}

module.exports = { obtenerBd };
