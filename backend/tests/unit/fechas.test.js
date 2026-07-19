const { analizarFechaLocal } = require('../../src/utilidades/fechas');

describe('analizarFechaLocal', () => {
  it('interpreta un string YYYY-MM-DD como medianoche local, no UTC', () => {
    // Antes del fix, `new Date('2026-07-20')` (lunes) se interpretaba como
    // medianoche UTC, que en cualquier zona horaria detrás de UTC cae en el
    // día calendario anterior en hora local (domingo) — corrompiendo el
    // día de la semana usado para buscar el horario laboral.
    const fecha = analizarFechaLocal('2026-07-20');
    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(6); // julio, 0-indexado
    expect(fecha.getDate()).toBe(20);
    expect(fecha.getHours()).toBe(0);
    expect(fecha.getDay()).toBe(1); // lunes
  });

  it('mantiene el día de la semana correcto para toda una semana', () => {
    const dias = [
      ['2026-07-19', 0], // domingo
      ['2026-07-20', 1], // lunes
      ['2026-07-21', 2], // martes
      ['2026-07-22', 3], // miércoles
      ['2026-07-23', 4], // jueves
      ['2026-07-24', 5], // viernes
      ['2026-07-25', 6], // sábado
    ];

    for (const [texto, diaEsperado] of dias) {
      expect(analizarFechaLocal(texto).getDay()).toBe(diaEsperado);
    }
  });

  it('retorna una fecha inválida cuando el texto no tiene formato YYYY-MM-DD', () => {
    expect(Number.isNaN(analizarFechaLocal('no-es-una-fecha').getTime())).toBe(true);
  });
});
