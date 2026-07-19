class ErrorApi extends Error {
  constructor(codigoEstado, mensaje, detalles = null) {
    super(mensaje);
    this.codigoEstado = codigoEstado;
    this.detalles = detalles;
  }
}

module.exports = ErrorApi;
