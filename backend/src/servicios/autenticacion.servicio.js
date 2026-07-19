const bcrypt = require('bcryptjs');
const usuarioRepositorio = require('../repositorios/usuario.repositorio');
const tokenRefrescoRepositorio = require('../repositorios/tokenRefresco.repositorio');
const {
  firmarTokenAcceso,
  firmarTokenRefresco,
  verificarTokenRefresco,
  hashearToken,
  TTL_TOKEN_REFRESCO_MS,
} = require('../utilidades/tokens');
const registroActividadServicio = require('./registroActividad.servicio');
const ErrorApi = require('../utilidades/ErrorApi');

function limpiarUsuario(usuario) {
  const { hashContrasena: _hashContrasena, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
}

async function emitirParTokens(usuario) {
  const tokenAcceso = firmarTokenAcceso({ id: usuario.id, rol: usuario.rol });
  const tokenRefresco = firmarTokenRefresco({ id: usuario.id });

  await tokenRefrescoRepositorio.crear({
    hashToken: hashearToken(tokenRefresco),
    usuarioId: usuario.id,
    expiraEn: new Date(Date.now() + TTL_TOKEN_REFRESCO_MS),
  });

  return { tokenAcceso, tokenRefresco };
}

async function iniciarSesion(correo, contrasena) {
  const usuario = await usuarioRepositorio.buscarPorCorreo(correo);

  if (!usuario || !usuario.activo) {
    throw new ErrorApi(401, 'Credenciales inválidas');
  }

  const contrasenaCoincide = await bcrypt.compare(contrasena, usuario.hashContrasena);
  if (!contrasenaCoincide) {
    throw new ErrorApi(401, 'Credenciales inválidas');
  }

  const tokens = await emitirParTokens(usuario);

  registroActividadServicio
    .registrarActividad({
      actorId: usuario.id,
      rolActor: usuario.rol,
      accion: 'INICIO_SESION',
      objetivoId: usuario.id,
    })
    .catch(() => {});

  return { ...tokens, usuario: limpiarUsuario(usuario) };
}

async function renovar(tokenRefrescoCrudo) {
  if (!tokenRefrescoCrudo) {
    throw new ErrorApi(401, 'Falta el token de refresco');
  }

  let cargaUtil;
  try {
    cargaUtil = verificarTokenRefresco(tokenRefrescoCrudo);
  } catch (_err) {
    throw new ErrorApi(401, 'Token de refresco inválido o expirado');
  }

  const tokenGuardado = await tokenRefrescoRepositorio.buscarValidoPorHash(
    hashearToken(tokenRefrescoCrudo),
  );
  if (!tokenGuardado) {
    throw new ErrorApi(401, 'El token de refresco fue revocado o es desconocido');
  }

  const usuario = await usuarioRepositorio.buscarPorId(cargaUtil.sub);
  if (!usuario || !usuario.activo) {
    throw new ErrorApi(401, 'Credenciales inválidas');
  }

  await tokenRefrescoRepositorio.revocar(tokenGuardado.id);

  const tokens = await emitirParTokens(usuario);
  return { ...tokens, usuario: limpiarUsuario(usuario) };
}

module.exports = { iniciarSesion, renovar };
