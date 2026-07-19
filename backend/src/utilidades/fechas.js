// `new Date('2026-07-20')` trata los strings solo-fecha (sin hora) como UTC
// medianoche, no como fecha local. En zonas horarias detrás de UTC (ej. Chile,
// UTC-4) eso hace que el instante caiga en el día calendario ANTERIOR en hora
// local, lo que corrompe el cálculo de día de la semana / horario laboral.
// Esta función arma la fecha con el constructor (año, mes, día) que Date SÍ
// interpreta como hora local, sin ambigüedad.
function analizarFechaLocal(texto) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!coincidencia) {
    return new Date(texto);
  }

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);
  return new Date(anio, mes - 1, dia);
}

module.exports = { analizarFechaLocal };
