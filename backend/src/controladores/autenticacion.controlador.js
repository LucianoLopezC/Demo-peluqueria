const autenticacionServicio = require('../servicios/autenticacion.servicio');
const manejadorAsincrono = require('../utilidades/manejadorAsincrono');
const entorno = require('../configuracion/entorno');

const NOMBRE_COOKIE_REFRESCO = 'tokenRefresco';
const OPCIONES_COOKIE_REFRESCO = {
  httpOnly: true,
  secure: entorno.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const iniciarSesion = manejadorAsincrono(async (req, res) => {
  const { correo, contrasena } = req.body;
  const { tokenAcceso, tokenRefresco, usuario } = await autenticacionServicio.iniciarSesion(
    correo,
    contrasena,
  );

  res.cookie(NOMBRE_COOKIE_REFRESCO, tokenRefresco, OPCIONES_COOKIE_REFRESCO);
  res.json({ tokenAcceso, usuario });
});

const iniciarSesionDemo = manejadorAsincrono(async (req, res) => {
  const { tokenAcceso, tokenRefresco, usuario } = await autenticacionServicio.iniciarSesionDemo();

  res.cookie(NOMBRE_COOKIE_REFRESCO, tokenRefresco, OPCIONES_COOKIE_REFRESCO);
  res.json({ tokenAcceso, usuario });
});

const renovar = manejadorAsincrono(async (req, res) => {
  const tokenRefrescoCrudo = req.cookies[NOMBRE_COOKIE_REFRESCO];
  const { tokenAcceso, tokenRefresco, usuario } =
    await autenticacionServicio.renovar(tokenRefrescoCrudo);

  res.cookie(NOMBRE_COOKIE_REFRESCO, tokenRefresco, OPCIONES_COOKIE_REFRESCO);
  res.json({ tokenAcceso, usuario });
});

const cerrarSesion = manejadorAsincrono(async (req, res) => {
  res.clearCookie(NOMBRE_COOKIE_REFRESCO, OPCIONES_COOKIE_REFRESCO);
  res.status(204).send();
});

module.exports = { iniciarSesion, iniciarSesionDemo, renovar, cerrarSesion };
