const usuarioRepositorio = require('../repositorios/usuario.repositorio');

async function listarProfesionales() {
  return usuarioRepositorio.buscarProfesionalesActivos();
}

module.exports = { listarProfesionales };
