function esPasado(inicioIntervalo, ahora) {
  return inicioIntervalo.getTime() < ahora.getTime();
}

function rangosSuperpuestos(inicioA, finA, inicioB, finB) {
  return inicioA.getTime() < finB.getTime() && finA.getTime() > inicioB.getTime();
}

function tieneConflicto(inicioCandidato, finCandidato, reservasExistentes) {
  return reservasExistentes
    .filter((reserva) => reserva.estado !== 'CANCELADA')
    .some((reserva) =>
      rangosSuperpuestos(inicioCandidato, finCandidato, reserva.horaInicio, reserva.horaFin),
    );
}

function minutosDelDia(fecha) {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

function analizarHHmmAMinutos(hhmm) {
  const [horas, minutos] = hhmm.split(':').map(Number);
  return horas * 60 + minutos;
}

function estaEnHorarioLaboral(inicioCandidato, finCandidato, horarioLaboralDelDia) {
  if (!horarioLaboralDelDia || !horarioLaboralDelDia.activo) {
    return false;
  }

  const inicioCandidatoMin = minutosDelDia(inicioCandidato);
  const finCandidatoMin = minutosDelDia(finCandidato);
  const aperturaMin = analizarHHmmAMinutos(horarioLaboralDelDia.horaInicio);
  const cierreMin = analizarHHmmAMinutos(horarioLaboralDelDia.horaFin);

  if (inicioCandidatoMin < aperturaMin || finCandidatoMin > cierreMin) {
    return false;
  }

  if (horarioLaboralDelDia.inicioDescanso && horarioLaboralDelDia.finDescanso) {
    const inicioDescansoMin = analizarHHmmAMinutos(horarioLaboralDelDia.inicioDescanso);
    const finDescansoMin = analizarHHmmAMinutos(horarioLaboralDelDia.finDescanso);
    const superponeDescanso =
      inicioCandidatoMin < finDescansoMin && finCandidatoMin > inicioDescansoMin;
    if (superponeDescanso) {
      return false;
    }
  }

  return true;
}

function calcularFinIntervalo(inicioIntervalo, duracionMinutos) {
  return new Date(inicioIntervalo.getTime() + duracionMinutos * 60 * 1000);
}

function validarIntervalo({
  inicioIntervalo,
  duracionMinutos,
  ahora,
  horarioLaboralDelDia,
  reservasExistentes,
}) {
  if (esPasado(inicioIntervalo, ahora)) {
    return { valido: false, motivo: 'PASADO' };
  }

  const finIntervalo = calcularFinIntervalo(inicioIntervalo, duracionMinutos);

  if (!estaEnHorarioLaboral(inicioIntervalo, finIntervalo, horarioLaboralDelDia)) {
    return { valido: false, motivo: 'FUERA_DE_HORARIO' };
  }

  if (tieneConflicto(inicioIntervalo, finIntervalo, reservasExistentes)) {
    return { valido: false, motivo: 'CONFLICTO' };
  }

  return { valido: true, motivo: null };
}

function generarIntervalosDisponibles({
  fecha,
  duracionMinutos,
  horarioLaboralDelDia,
  reservasExistentes,
  ahora,
  pasoMinutos = 30,
}) {
  if (!horarioLaboralDelDia || !horarioLaboralDelDia.activo) {
    return [];
  }

  const intervalos = [];
  const aperturaMin = analizarHHmmAMinutos(horarioLaboralDelDia.horaInicio);
  const cierreMin = analizarHHmmAMinutos(horarioLaboralDelDia.horaFin);

  const inicioDia = new Date(fecha);
  inicioDia.setHours(0, 0, 0, 0);

  for (let minuto = aperturaMin; minuto + duracionMinutos <= cierreMin; minuto += pasoMinutos) {
    const inicioIntervalo = new Date(inicioDia.getTime() + minuto * 60 * 1000);
    const { valido } = validarIntervalo({
      inicioIntervalo,
      duracionMinutos,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes,
    });

    if (valido) {
      intervalos.push(inicioIntervalo);
    }
  }

  return intervalos;
}

module.exports = {
  esPasado,
  rangosSuperpuestos,
  tieneConflicto,
  estaEnHorarioLaboral,
  calcularFinIntervalo,
  validarIntervalo,
  generarIntervalosDisponibles,
};
