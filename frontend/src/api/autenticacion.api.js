import clienteAxios from './clienteAxios';

export async function iniciarSesion(correo, contrasena) {
  const { data } = await clienteAxios.post('/autenticacion/iniciar-sesion', { correo, contrasena });
  return data;
}

export async function renovarSesion() {
  const { data } = await clienteAxios.post('/autenticacion/renovar');
  return data;
}

export async function cerrarSesion() {
  await clienteAxios.post('/autenticacion/cerrar-sesion');
}
