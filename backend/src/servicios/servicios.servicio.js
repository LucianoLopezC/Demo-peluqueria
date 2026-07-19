const servicioRepositorio = require('../repositorios/servicio.repositorio');

async function listarServicios() {
  return servicioRepositorio.buscarTodosActivos();
}

module.exports = { listarServicios };
