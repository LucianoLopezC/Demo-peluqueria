import { useEffect, useState } from 'react';
import SeccionMarmol from '../comunes/SeccionMarmol';
import TituloSerif from '../comunes/TituloSerif';
import Boton from '../comunes/Boton';
import { obtenerServicios } from '../../api/servicios.api';
import { obtenerProfesionales } from '../../api/profesionales.api';
import {
  obtenerTokenCsrf,
  obtenerIntervalosDisponibles,
  crearReserva,
} from '../../api/reservas.api';

function formatearEtiquetaIntervalo(iso) {
  return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}

function inicioDeHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
}

function construirDiasSemana(offsetSemana) {
  const inicio = inicioDeHoy();
  return Array.from({ length: 7 }, (_, indice) => {
    const fecha = new Date(inicio);
    fecha.setDate(fecha.getDate() + offsetSemana * 7 + indice);
    return fecha;
  });
}

function aClaveFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

function formatearEncabezadoDia(fecha) {
  return fecha.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
}

const CLASE_CAMPO =
  'border border-marble-500/30 bg-marble-50 px-4 py-3 text-ink placeholder:text-marble-400';
const CLASE_ETIQUETA = 'grid gap-2 font-sans text-sm text-marble-300';

function FormularioReserva() {
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  const [servicioId, setServicioId] = useState('');
  const [profesionalId, setProfesionalId] = useState('');

  const [offsetSemana, setOffsetSemana] = useState(0);
  const [dias, setDias] = useState([]);
  const [intervaloSeleccionado, setIntervaloSeleccionado] = useState('');

  const [cliente, setCliente] = useState({ nombreCompleto: '', telefono: '', correo: '' });
  const [estadoEnvio, setEstadoEnvio] = useState('inactivo');
  const [errorEnvio, setErrorEnvio] = useState('');

  useEffect(() => {
    obtenerTokenCsrf().catch(() => {});
    obtenerServicios()
      .then(setServicios)
      .catch(() => {});
    obtenerProfesionales()
      .then(setProfesionales)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!servicioId || !profesionalId) {
      setDias([]);
      return;
    }

    const fechasSemana = construirDiasSemana(offsetSemana);
    setIntervaloSeleccionado('');
    setDias(
      fechasSemana.map((fecha) => ({
        fecha,
        claveFecha: aClaveFecha(fecha),
        intervalos: [],
        estado: 'cargando',
      })),
    );

    let cancelado = false;

    fechasSemana.forEach((fecha, indice) => {
      obtenerIntervalosDisponibles({ profesionalId, servicioId, fecha: aClaveFecha(fecha) })
        .then((intervalosDisponibles) => {
          if (cancelado) return;
          setDias((prev) =>
            prev.map((dia, i) =>
              i === indice ? { ...dia, intervalos: intervalosDisponibles, estado: 'listo' } : dia,
            ),
          );
        })
        .catch(() => {
          if (cancelado) return;
          setDias((prev) => prev.map((dia, i) => (i === indice ? { ...dia, estado: 'error' } : dia)));
        });
    });

    return () => {
      cancelado = true;
    };
  }, [servicioId, profesionalId, offsetSemana]);

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setEstadoEnvio('cargando');
    setErrorEnvio('');

    try {
      await crearReserva({
        profesionalId,
        servicioId,
        horaInicio: intervaloSeleccionado,
        cliente,
      });
      setEstadoEnvio('exito');
    } catch (err) {
      setEstadoEnvio('error');
      setErrorEnvio(
        err.response?.data?.error || 'No pudimos completar la reserva, intenta nuevamente.',
      );
    }
  };

  return (
    <SeccionMarmol id="reservar" fondo="oscuro">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-60px] left-1/2 -translate-x-1/2 select-none font-display text-[420px] leading-none text-marble-50/[0.04]"
      >
        Ω
      </div>

      <div className="relative mx-auto max-w-4xl">
        {estadoEnvio === 'exito' ? (
          <div className="text-center">
            <TituloSerif antetitulo="Reserva" claro>
              Solicitud enviada
            </TituloSerif>
            <p className="font-sans font-light text-marble-300">
              Gracias, {cliente.nombreCompleto.split(' ')[0]}. Tu hora ha quedado agendada. Te
              esperamos.
            </p>
          </div>
        ) : (
          <>
            <TituloSerif antetitulo="Reserva tu hora" claro>
              Tu silla te espera
            </TituloSerif>

            <form onSubmit={manejarEnvio} className="grid gap-8">
              <div className="mx-auto grid w-full max-w-xl gap-6">
                <label className={CLASE_ETIQUETA}>
                  Servicio
                  <select
                    required
                    value={servicioId}
                    onChange={(e) => setServicioId(e.target.value)}
                    className={CLASE_CAMPO}
                  >
                    <option value="" disabled>
                      Selecciona un servicio
                    </option>
                    {servicios.map((servicio) => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={CLASE_ETIQUETA}>
                  Profesional
                  <select
                    required
                    value={profesionalId}
                    onChange={(e) => setProfesionalId(e.target.value)}
                    className={CLASE_CAMPO}
                  >
                    <option value="" disabled>
                      Selecciona un profesional
                    </option>
                    {profesionales.map((profesional) => (
                      <option key={profesional.id} value={profesional.id}>
                        {profesional.nombreCompleto}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {servicioId && profesionalId && (
                <div>
                  <div className="mb-4 flex items-center justify-between font-sans text-xs tracking-greek text-marble-300 uppercase">
                    <button
                      type="button"
                      disabled={offsetSemana === 0}
                      onClick={() => setOffsetSemana((s) => s - 1)}
                      className="disabled:pointer-events-none disabled:opacity-30"
                    >
                      ‹ Semana anterior
                    </button>
                    <button type="button" onClick={() => setOffsetSemana((s) => s + 1)}>
                      Semana siguiente ›
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {dias.map((dia) => (
                      <div
                        key={dia.claveFecha}
                        className="border border-marble-500/25 bg-marble-50/5 p-3"
                      >
                        <p className="text-center font-sans text-xs tracking-greek text-marble-300 uppercase">
                          {formatearEncabezadoDia(dia.fecha)}
                        </p>
                        <div className="scrollbar-fina mt-3 flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-1.5">
                          {dia.estado === 'cargando' && (
                            <p className="text-center text-xs text-marble-400">...</p>
                          )}
                          {dia.estado === 'error' && (
                            <p className="text-center text-xs text-marble-400">Error</p>
                          )}
                          {dia.estado === 'listo' && dia.intervalos.length === 0 && (
                            <p className="text-center text-xs text-marble-400">Sin horas</p>
                          )}
                          {dia.intervalos.map((intervalo) => (
                            <button
                              type="button"
                              key={intervalo}
                              onClick={() => setIntervaloSeleccionado(intervalo)}
                              className={`border px-2 py-1.5 text-xs transition-colors ${
                                intervaloSeleccionado === intervalo
                                  ? 'border-marble-50 bg-marble-50 text-ink'
                                  : 'border-marble-500/40 text-marble-50 hover:border-marble-50'
                              }`}
                            >
                              {formatearEtiquetaIntervalo(intervalo)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {intervaloSeleccionado && (
                <div className="mx-auto grid w-full max-w-xl gap-6">
                  <label className={CLASE_ETIQUETA}>
                    Nombre completo
                    <input
                      required
                      type="text"
                      value={cliente.nombreCompleto}
                      onChange={(e) => setCliente({ ...cliente, nombreCompleto: e.target.value })}
                      className={CLASE_CAMPO}
                    />
                  </label>

                  <label className={CLASE_ETIQUETA}>
                    Teléfono
                    <input
                      required
                      type="tel"
                      value={cliente.telefono}
                      onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                      className={CLASE_CAMPO}
                    />
                  </label>

                  <label className={CLASE_ETIQUETA}>
                    Email (opcional)
                    <input
                      type="email"
                      value={cliente.correo}
                      onChange={(e) => setCliente({ ...cliente, correo: e.target.value })}
                      className={CLASE_CAMPO}
                    />
                  </label>

                  {estadoEnvio === 'error' && <p className="text-sm text-red-300">{errorEnvio}</p>}

                  <Boton variant="claro" type="submit" disabled={estadoEnvio === 'cargando'}>
                    {estadoEnvio === 'cargando' ? 'Enviando...' : 'Confirmar reserva'}
                  </Boton>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </SeccionMarmol>
  );
}

export default FormularioReserva;
