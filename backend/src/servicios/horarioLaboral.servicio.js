const horarioLaboralRepositorio = require('../repositorios/horarioLaboral.repositorio');

async function listarPorProfesional(profesionalId) {
  return horarioLaboralRepositorio.buscarTodosPorProfesional(profesionalId);
}

async function actualizarHorario(profesionalId, dias) {
  const actualizados = await Promise.all(
    dias.map((dia) =>
      horarioLaboralRepositorio.guardarDia(profesionalId, dia.diaSemana, {
        horaInicio: dia.horaInicio,
        horaFin: dia.horaFin,
        inicioDescanso: dia.inicioDescanso ?? null,
        finDescanso: dia.finDescanso ?? null,
        activo: dia.activo,
      }),
    ),
  );
  return actualizados;
}

module.exports = { listarPorProfesional, actualizarHorario };
