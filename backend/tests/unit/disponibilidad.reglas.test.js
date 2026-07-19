const {
  esPasado,
  rangosSuperpuestos,
  tieneConflicto,
  estaEnHorarioLaboral,
  calcularFinIntervalo,
  validarIntervalo,
  generarIntervalosDisponibles,
} = require('../../src/servicios/disponibilidad/disponibilidad.reglas');

describe('esPasado', () => {
  it('retorna true cuando el inicio es antes de ahora', () => {
    const ahora = new Date('2026-07-20T10:00:00');
    const inicioIntervalo = new Date('2026-07-20T09:00:00');
    expect(esPasado(inicioIntervalo, ahora)).toBe(true);
  });

  it('retorna false cuando el inicio es después de ahora', () => {
    const ahora = new Date('2026-07-20T10:00:00');
    const inicioIntervalo = new Date('2026-07-20T11:00:00');
    expect(esPasado(inicioIntervalo, ahora)).toBe(false);
  });

  it('retorna false cuando el inicio es exactamente igual a ahora', () => {
    const ahora = new Date('2026-07-20T10:00:00');
    const inicioIntervalo = new Date('2026-07-20T10:00:00');
    expect(esPasado(inicioIntervalo, ahora)).toBe(false);
  });
});

describe('rangosSuperpuestos', () => {
  it('retorna true cuando el candidato contiene por completo una reserva existente', () => {
    expect(
      rangosSuperpuestos(
        new Date('2026-07-20T09:00:00'),
        new Date('2026-07-20T12:00:00'),
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T11:00:00'),
      ),
    ).toBe(true);
  });

  it('retorna true cuando la reserva existente contiene por completo al candidato', () => {
    expect(
      rangosSuperpuestos(
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T11:00:00'),
        new Date('2026-07-20T09:00:00'),
        new Date('2026-07-20T12:00:00'),
      ),
    ).toBe(true);
  });

  it('retorna true cuando los rangos se superponen parcialmente al inicio', () => {
    expect(
      rangosSuperpuestos(
        new Date('2026-07-20T09:00:00'),
        new Date('2026-07-20T10:30:00'),
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T11:00:00'),
      ),
    ).toBe(true);
  });

  it('retorna true cuando los rangos se superponen parcialmente al final', () => {
    expect(
      rangosSuperpuestos(
        new Date('2026-07-20T10:30:00'),
        new Date('2026-07-20T12:00:00'),
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T11:00:00'),
      ),
    ).toBe(true);
  });

  it('retorna false cuando los rangos son adyacentes pero no se superponen (el candidato termina justo cuando empieza el existente)', () => {
    expect(
      rangosSuperpuestos(
        new Date('2026-07-20T09:00:00'),
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T11:00:00'),
      ),
    ).toBe(false);
  });

  it('retorna false cuando los rangos son completamente disjuntos', () => {
    expect(
      rangosSuperpuestos(
        new Date('2026-07-20T08:00:00'),
        new Date('2026-07-20T09:00:00'),
        new Date('2026-07-20T15:00:00'),
        new Date('2026-07-20T16:00:00'),
      ),
    ).toBe(false);
  });
});

describe('tieneConflicto', () => {
  const inicioCandidato = new Date('2026-07-20T10:00:00');
  const finCandidato = new Date('2026-07-20T11:00:00');

  it('retorna false cuando la lista de reservas existentes está vacía', () => {
    expect(tieneConflicto(inicioCandidato, finCandidato, [])).toBe(false);
  });

  it('retorna true cuando el candidato se superpone con una de varias reservas existentes', () => {
    const reservasExistentes = [
      {
        horaInicio: new Date('2026-07-20T08:00:00'),
        horaFin: new Date('2026-07-20T09:00:00'),
        estado: 'CONFIRMADA',
      },
      {
        horaInicio: new Date('2026-07-20T10:30:00'),
        horaFin: new Date('2026-07-20T11:30:00'),
        estado: 'CONFIRMADA',
      },
    ];
    expect(tieneConflicto(inicioCandidato, finCandidato, reservasExistentes)).toBe(true);
  });

  it('ignora las reservas con estado CANCELADA al buscar conflictos', () => {
    const reservasExistentes = [
      {
        horaInicio: new Date('2026-07-20T10:00:00'),
        horaFin: new Date('2026-07-20T11:00:00'),
        estado: 'CANCELADA',
      },
    ];
    expect(tieneConflicto(inicioCandidato, finCandidato, reservasExistentes)).toBe(false);
  });
});

describe('estaEnHorarioLaboral', () => {
  const horarioLaboral = {
    horaInicio: '09:00',
    horaFin: '18:00',
    inicioDescanso: '13:00',
    finDescanso: '14:00',
    activo: true,
  };

  it('retorna false cuando el profesional no trabaja ese día (sin horario / inactivo)', () => {
    expect(
      estaEnHorarioLaboral(new Date('2026-07-20T10:00:00'), new Date('2026-07-20T11:00:00'), null),
    ).toBe(false);

    expect(
      estaEnHorarioLaboral(new Date('2026-07-20T10:00:00'), new Date('2026-07-20T11:00:00'), {
        ...horarioLaboral,
        activo: false,
      }),
    ).toBe(false);
  });

  it('retorna true cuando el intervalo calza completamente dentro del horario laboral', () => {
    expect(
      estaEnHorarioLaboral(
        new Date('2026-07-20T10:00:00'),
        new Date('2026-07-20T11:00:00'),
        horarioLaboral,
      ),
    ).toBe(true);
  });

  it('retorna false cuando el intervalo empieza antes de la apertura', () => {
    expect(
      estaEnHorarioLaboral(
        new Date('2026-07-20T08:00:00'),
        new Date('2026-07-20T09:30:00'),
        horarioLaboral,
      ),
    ).toBe(false);
  });

  it('retorna false cuando el intervalo termina después del cierre', () => {
    expect(
      estaEnHorarioLaboral(
        new Date('2026-07-20T17:30:00'),
        new Date('2026-07-20T18:30:00'),
        horarioLaboral,
      ),
    ).toBe(false);
  });

  it('retorna false cuando el intervalo se superpone con el descanso/almuerzo', () => {
    expect(
      estaEnHorarioLaboral(
        new Date('2026-07-20T12:30:00'),
        new Date('2026-07-20T13:30:00'),
        horarioLaboral,
      ),
    ).toBe(false);
  });

  it('retorna true cuando el intervalo está completamente antes del descanso', () => {
    expect(
      estaEnHorarioLaboral(
        new Date('2026-07-20T11:00:00'),
        new Date('2026-07-20T12:00:00'),
        horarioLaboral,
      ),
    ).toBe(true);
  });

  it('retorna true cuando el intervalo está completamente después del descanso', () => {
    expect(
      estaEnHorarioLaboral(
        new Date('2026-07-20T14:00:00'),
        new Date('2026-07-20T15:00:00'),
        horarioLaboral,
      ),
    ).toBe(true);
  });
});

describe('calcularFinIntervalo', () => {
  it('suma la duración del servicio en minutos al inicio del intervalo', () => {
    const inicioIntervalo = new Date('2026-07-20T10:00:00');
    expect(calcularFinIntervalo(inicioIntervalo, 45).toISOString()).toBe(
      new Date('2026-07-20T10:45:00').toISOString(),
    );
  });

  it('cruza correctamente la medianoche si la duración pasa el fin del día', () => {
    const inicioIntervalo = new Date('2026-07-20T23:30:00');
    expect(calcularFinIntervalo(inicioIntervalo, 60).toISOString()).toBe(
      new Date('2026-07-21T00:30:00').toISOString(),
    );
  });
});

describe('validarIntervalo', () => {
  const ahora = new Date('2026-07-20T08:00:00');
  const horarioLaboralDelDia = {
    horaInicio: '09:00',
    horaFin: '18:00',
    inicioDescanso: '13:00',
    finDescanso: '14:00',
    activo: true,
  };

  it('rechaza con motivo PASADO cuando el intervalo ya pasó', () => {
    const resultado = validarIntervalo({
      inicioIntervalo: new Date('2026-07-20T07:00:00'),
      duracionMinutos: 30,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes: [],
    });
    expect(resultado).toEqual({ valido: false, motivo: 'PASADO' });
  });

  it('rechaza con motivo FUERA_DE_HORARIO cuando el intervalo está fuera del horario laboral', () => {
    const resultado = validarIntervalo({
      inicioIntervalo: new Date('2026-07-20T19:00:00'),
      duracionMinutos: 30,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes: [],
    });
    expect(resultado).toEqual({ valido: false, motivo: 'FUERA_DE_HORARIO' });
  });

  it('rechaza con motivo FUERA_DE_HORARIO cuando el intervalo cae en el descanso', () => {
    const resultado = validarIntervalo({
      inicioIntervalo: new Date('2026-07-20T13:15:00'),
      duracionMinutos: 30,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes: [],
    });
    expect(resultado).toEqual({ valido: false, motivo: 'FUERA_DE_HORARIO' });
  });

  it('rechaza con motivo CONFLICTO cuando el intervalo se superpone con una reserva confirmada', () => {
    const resultado = validarIntervalo({
      inicioIntervalo: new Date('2026-07-20T10:00:00'),
      duracionMinutos: 30,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes: [
        {
          horaInicio: new Date('2026-07-20T10:15:00'),
          horaFin: new Date('2026-07-20T10:45:00'),
          estado: 'CONFIRMADA',
        },
      ],
    });
    expect(resultado).toEqual({ valido: false, motivo: 'CONFLICTO' });
  });

  it('acepta un intervalo válido que respeta horario, duración y no tiene conflictos', () => {
    const resultado = validarIntervalo({
      inicioIntervalo: new Date('2026-07-20T10:00:00'),
      duracionMinutos: 30,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes: [],
    });
    expect(resultado).toEqual({ valido: true, motivo: null });
  });

  it('acepta un intervalo válido exactamente adyacente a una reserva existente (reservas espalda con espalda permitidas)', () => {
    const resultado = validarIntervalo({
      inicioIntervalo: new Date('2026-07-20T10:30:00'),
      duracionMinutos: 30,
      ahora,
      horarioLaboralDelDia,
      reservasExistentes: [
        {
          horaInicio: new Date('2026-07-20T10:00:00'),
          horaFin: new Date('2026-07-20T10:30:00'),
          estado: 'CONFIRMADA',
        },
      ],
    });
    expect(resultado).toEqual({ valido: true, motivo: null });
  });
});

describe('generarIntervalosDisponibles', () => {
  const ahora = new Date('2026-07-20T08:00:00');
  const horarioLaboralDelDia = {
    horaInicio: '09:00',
    horaFin: '11:00',
    inicioDescanso: null,
    finDescanso: null,
    activo: true,
  };

  it('retorna un arreglo vacío cuando el profesional no trabaja ese día', () => {
    const intervalos = generarIntervalosDisponibles({
      fecha: new Date('2026-07-20T00:00:00'),
      duracionMinutos: 30,
      horarioLaboralDelDia: null,
      reservasExistentes: [],
      ahora,
      pasoMinutos: 30,
    });
    expect(intervalos).toEqual([]);
  });

  it('no retorna intervalos antes de la hora actual cuando la fecha es hoy', () => {
    const intervalos = generarIntervalosDisponibles({
      fecha: new Date('2026-07-20T00:00:00'),
      duracionMinutos: 30,
      horarioLaboralDelDia: { ...horarioLaboralDelDia, horaInicio: '07:00' },
      reservasExistentes: [],
      ahora: new Date('2026-07-20T08:00:00'),
      pasoMinutos: 30,
    });
    expect(intervalos.every((intervalo) => intervalo.getTime() >= ahora.getTime())).toBe(true);
  });

  it('retorna intervalos con el paso solicitado a lo largo de toda la ventana laboral', () => {
    const intervalos = generarIntervalosDisponibles({
      fecha: new Date('2026-07-20T00:00:00'),
      duracionMinutos: 30,
      horarioLaboralDelDia,
      reservasExistentes: [],
      ahora,
      pasoMinutos: 30,
    });
    const esperado = ['09:00', '09:30', '10:00', '10:30'];
    expect(intervalos.map((i) => i.toTimeString().slice(0, 5))).toEqual(esperado);
  });

  it('excluye intervalos que se superpondrían con el descanso', () => {
    const intervalos = generarIntervalosDisponibles({
      fecha: new Date('2026-07-20T00:00:00'),
      duracionMinutos: 30,
      horarioLaboralDelDia: {
        horaInicio: '09:00',
        horaFin: '11:00',
        inicioDescanso: '09:30',
        finDescanso: '10:00',
        activo: true,
      },
      reservasExistentes: [],
      ahora,
      pasoMinutos: 30,
    });
    expect(intervalos.map((i) => i.toTimeString().slice(0, 5))).toEqual([
      '09:00',
      '10:00',
      '10:30',
    ]);
  });

  it('excluye intervalos que se superpondrían con una reserva existente', () => {
    const intervalos = generarIntervalosDisponibles({
      fecha: new Date('2026-07-20T00:00:00'),
      duracionMinutos: 30,
      horarioLaboralDelDia,
      reservasExistentes: [
        {
          horaInicio: new Date('2026-07-20T09:30:00'),
          horaFin: new Date('2026-07-20T10:00:00'),
          estado: 'CONFIRMADA',
        },
      ],
      ahora,
      pasoMinutos: 30,
    });
    expect(intervalos.map((i) => i.toTimeString().slice(0, 5))).toEqual([
      '09:00',
      '10:00',
      '10:30',
    ]);
  });

  it('excluye intervalos demasiado cerca del cierre para que quepa la duración completa del servicio', () => {
    const intervalos = generarIntervalosDisponibles({
      fecha: new Date('2026-07-20T00:00:00'),
      duracionMinutos: 45,
      horarioLaboralDelDia,
      reservasExistentes: [],
      ahora,
      pasoMinutos: 30,
    });
    // la ventana es 09:00-11:00; con 45min de duración, 10:30 terminaría a las 11:15 (pasado el cierre) así que se excluye
    expect(intervalos.map((i) => i.toTimeString().slice(0, 5))).toEqual([
      '09:00',
      '09:30',
      '10:00',
    ]);
  });
});
