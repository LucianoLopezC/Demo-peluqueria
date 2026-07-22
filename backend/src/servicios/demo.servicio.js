const reservaRepositorio = require('../repositorios/reserva.repositorio');
const clienteRepositorio = require('../repositorios/cliente.repositorio');
const horarioLaboralRepositorio = require('../repositorios/horarioLaboral.repositorio');
const tokenRefrescoRepositorio = require('../repositorios/tokenRefresco.repositorio');
const usuarioRepositorio = require('../repositorios/usuario.repositorio');
const { obtenerBd } = require('../configuracion/mongo');

const HORARIO_POR_DEFECTO = {
  horaInicio: '09:00',
  horaFin: '18:00',
  inicioDescanso: '13:00',
  finDescanso: '14:00',
};
const DIAS_LABORALES = [1, 2, 3, 4, 5];

async function restaurarHorariosPorDefecto() {
  await horarioLaboralRepositorio.eliminarTodos();
  const staff = await usuarioRepositorio.buscarStaffActivo();

  for (const persona of staff) {
    for (const diaSemana of DIAS_LABORALES) {
      await horarioLaboralRepositorio.guardarDia(persona.id, diaSemana, HORARIO_POR_DEFECTO);
    }
  }
}

// Best-effort: si Mongo no está configurado o falla, el reinicio de Postgres
// ya se hizo y no debe considerarse un error fatal (mismo criterio que el
// registro de actividad normal).
async function limpiarRegistrosMongo() {
  try {
    const bd = await obtenerBd();
    await bd.collection('registrosActividad').deleteMany({});
    await bd.collection('notificaciones').deleteMany({});
  } catch (err) {
    console.error('No se pudieron limpiar los registros de Mongo en el reinicio demo', err.message);
  }
}

async function reiniciarDemo() {
  await reservaRepositorio.eliminarTodas();
  await clienteRepositorio.eliminarTodos();
  await tokenRefrescoRepositorio.eliminarTodos();
  await restaurarHorariosPorDefecto();
  await limpiarRegistrosMongo();
}

module.exports = { reiniciarDemo };
