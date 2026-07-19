import { useState } from 'react';
import { obtenerIntervalosDisponibles } from '../../api/reservas.api';

function formatearEtiquetaIntervalo(iso) {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}

function TarjetaReserva({ reserva, onVerCliente, onCancelar, onReprogramar }) {
  const [reprogramando, setReprogramando] = useState(false);
  const [fecha, setFecha] = useState('');
  const [intervalos, setIntervalos] = useState([]);
  const [estadoIntervalos, setEstadoIntervalos] = useState('inactivo');

  const estaCancelada = reserva.estado === 'CANCELADA';

  const manejarCambioFecha = async (valor) => {
    setFecha(valor);
    setIntervalos([]);
    if (!valor) return;

    setEstadoIntervalos('cargando');
    try {
      const intervalosDisponibles = await obtenerIntervalosDisponibles({
        profesionalId: reserva.profesionalId,
        servicioId: reserva.servicioId,
        fecha: valor,
      });
      setIntervalos(intervalosDisponibles);
      setEstadoIntervalos('listo');
    } catch (_err) {
      setEstadoIntervalos('error');
    }
  };

  return (
    <div className="border border-marble-300 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display text-xl text-ink">{reserva.cliente.nombreCompleto}</h3>
          <p className="font-sans text-sm text-marble-500">{reserva.servicio.nombre}</p>
        </div>
        <p className="font-sans text-xs tracking-greek text-marble-500 uppercase">
          {new Date(reserva.horaInicio).toLocaleString('es-CL', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {estaCancelada && <p className="mt-3 font-sans text-sm text-red-700">Cancelada</p>}

      <div className="mt-4 flex flex-wrap gap-3 font-sans text-xs tracking-greek uppercase">
        <button
          type="button"
          onClick={() => onVerCliente(reserva)}
          className="border border-ink px-4 py-2 text-ink hover:bg-ink hover:text-marble-50"
        >
          Ver cliente
        </button>

        {!estaCancelada && (
          <>
            <button
              type="button"
              onClick={() => onCancelar(reserva.id)}
              className="border border-marble-400 px-4 py-2 text-marble-500 hover:border-ink hover:text-ink"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setReprogramando((prev) => !prev)}
              className="border border-marble-400 px-4 py-2 text-marble-500 hover:border-ink hover:text-ink"
            >
              Reprogramar
            </button>
          </>
        )}
      </div>

      {reprogramando && (
        <div className="mt-4 grid gap-3 border-t border-marble-200 pt-4">
          <input
            type="date"
            value={fecha}
            onChange={(e) => manejarCambioFecha(e.target.value)}
            className="border border-marble-300 bg-marble-50 px-4 py-2 text-sm text-ink"
          />

          {estadoIntervalos === 'cargando' && (
            <p className="text-sm text-marble-500">Buscando horas...</p>
          )}
          {estadoIntervalos === 'listo' && intervalos.length === 0 && (
            <p className="text-sm text-marble-500">Sin horas disponibles ese día.</p>
          )}

          {intervalos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {intervalos.map((intervalo) => (
                <button
                  key={intervalo}
                  type="button"
                  onClick={() => {
                    onReprogramar(reserva.id, intervalo);
                    setReprogramando(false);
                  }}
                  className="border border-marble-300 px-3 py-1 text-sm text-ink hover:border-ink"
                >
                  {formatearEtiquetaIntervalo(intervalo)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TarjetaReserva;
