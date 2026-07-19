import clienteAxios from './clienteAxios';

export async function obtenerProfesionales() {
  const { data } = await clienteAxios.get('/profesionales');
  return data;
}
