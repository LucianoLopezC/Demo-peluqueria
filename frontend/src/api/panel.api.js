import clienteAxios from './clienteAxios';

export async function obtenerMisReservas() {
  const { data } = await clienteAxios.get('/panel/reservas');
  return data;
}

export async function cancelarReserva(id) {
  const { data } = await clienteAxios.patch(`/panel/reservas/${id}/cancelar`);
  return data;
}

export async function reprogramarReserva(id, nuevaHoraInicio) {
  const { data } = await clienteAxios.patch(`/panel/reservas/${id}/reprogramar`, {
    nuevaHoraInicio,
  });
  return data;
}

export async function obtenerMiHorarioLaboral() {
  const { data } = await clienteAxios.get('/panel/horario-laboral');
  return data;
}

export async function actualizarMiHorarioLaboral(dias) {
  const { data } = await clienteAxios.put('/panel/horario-laboral', { dias });
  return data;
}
