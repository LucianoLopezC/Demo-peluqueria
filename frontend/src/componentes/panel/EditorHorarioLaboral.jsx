import { useState } from 'react';
import Boton from '../comunes/Boton';

const ETIQUETAS_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function construirDiasIniciales(diasExistentes) {
  const porDiaSemana = new Map(diasExistentes.map((dia) => [dia.diaSemana, dia]));

  return Array.from({ length: 7 }, (_, diaSemana) => {
    const existente = porDiaSemana.get(diaSemana);
    return {
      diaSemana,
      activo: existente?.activo ?? false,
      horaInicio: existente?.horaInicio ?? '09:00',
      horaFin: existente?.horaFin ?? '18:00',
      inicioDescanso: existente?.inicioDescanso ?? '',
      finDescanso: existente?.finDescanso ?? '',
    };
  });
}

function EditorHorarioLaboral({ diasIniciales, onGuardar, guardando }) {
  const [dias, setDias] = useState(() => construirDiasIniciales(diasIniciales));

  const actualizarDia = (diaSemana, parche) => {
    setDias((prev) =>
      prev.map((dia) => (dia.diaSemana === diaSemana ? { ...dia, ...parche } : dia)),
    );
  };

  const manejarEnvio = (event) => {
    event.preventDefault();
    onGuardar(
      dias.map((dia) => ({
        ...dia,
        inicioDescanso: dia.inicioDescanso || null,
        finDescanso: dia.finDescanso || null,
      })),
    );
  };

  return (
    <form onSubmit={manejarEnvio} className="grid gap-4">
      {dias.map((dia) => (
        <div
          key={dia.diaSemana}
          className="grid grid-cols-2 items-center gap-3 border border-marble-300 p-4 sm:grid-cols-5"
        >
          <label className="flex items-center gap-2 font-sans text-sm text-ink">
            <input
              type="checkbox"
              checked={dia.activo}
              onChange={(e) => actualizarDia(dia.diaSemana, { activo: e.target.checked })}
            />
            {ETIQUETAS_DIA[dia.diaSemana]}
          </label>

          <label className="grid gap-1 font-sans text-xs text-marble-500">
            Entrada
            <input
              type="time"
              value={dia.horaInicio}
              onChange={(e) => actualizarDia(dia.diaSemana, { horaInicio: e.target.value })}
              disabled={!dia.activo}
              className="border border-marble-300 bg-marble-50 px-2 py-1 text-ink"
            />
          </label>

          <label className="grid gap-1 font-sans text-xs text-marble-500">
            Salida
            <input
              type="time"
              value={dia.horaFin}
              onChange={(e) => actualizarDia(dia.diaSemana, { horaFin: e.target.value })}
              disabled={!dia.activo}
              className="border border-marble-300 bg-marble-50 px-2 py-1 text-ink"
            />
          </label>

          <label className="grid gap-1 font-sans text-xs text-marble-500">
            Inicio almuerzo
            <input
              type="time"
              value={dia.inicioDescanso}
              onChange={(e) => actualizarDia(dia.diaSemana, { inicioDescanso: e.target.value })}
              disabled={!dia.activo}
              className="border border-marble-300 bg-marble-50 px-2 py-1 text-ink"
            />
          </label>

          <label className="grid gap-1 font-sans text-xs text-marble-500">
            Fin almuerzo
            <input
              type="time"
              value={dia.finDescanso}
              onChange={(e) => actualizarDia(dia.diaSemana, { finDescanso: e.target.value })}
              disabled={!dia.activo}
              className="border border-marble-300 bg-marble-50 px-2 py-1 text-ink"
            />
          </label>
        </div>
      ))}

      <Boton type="submit" className="mt-2 w-fit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar horario'}
      </Boton>
    </form>
  );
}

export default EditorHorarioLaboral;
