import clienteAxios from './clienteAxios';

export async function obtenerServicios() {
  const { data } = await clienteAxios.get('/servicios');
  return data;
}
