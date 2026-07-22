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

// Cuenta fija que la semilla siempre crea (ver prisma/semilla.js) y que usa el
// botón "Entrar en modo demo" del login, sin pedir contraseña al visitante.
const CORREO_DEMO = 'profesional@peluqueria1.com';

function limpiarUsuario(usuario) {
  const { hashContrasena: _hashContrasena, ...usuarioSeguro } = usuario;
  return { ...usuarioSeguro, esDemo: usuario.correo === CORREO_DEMO };
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

async function iniciarSesionDemo() {
  const usuario = await usuarioRepositorio.buscarPorCorreo(CORREO_DEMO);

  if (!usuario || !usuario.activo) {
    throw new ErrorApi(503, 'El modo demo no está disponible');
  }

  const tokens = await emitirParTokens(usuario);

  registroActividadServicio
    .registrarActividad({
      actorId: usuario.id,
      rolActor: usuario.rol,
      accion: 'INICIO_SESION_DEMO',
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

module.exports = { iniciarSesion, iniciarSesionDemo, renovar };
