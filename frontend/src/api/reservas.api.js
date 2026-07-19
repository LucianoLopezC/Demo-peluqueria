import clienteAxios from './clienteAxios';

export async function obtenerTokenCsrf() {
  const { data } = await clienteAxios.get('/reservas/token-csrf');
  return data.tokenCsrf;
}

export async function obtenerIntervalosDisponibles({ profesionalId, servicioId, fecha }) {
  const { data } = await clienteAxios.get(`/disponibilidad/${profesionalId}`, {
    params: { servicioId, fecha },
  });
  return data.intervalos;
}

export async function crearReserva(payload) {
  const { data } = await clienteAxios.post('/reservas', payload);
  return data;
}
