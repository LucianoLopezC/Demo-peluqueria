import { useEffect, useState } from 'react';
import { obtenerMisReservas, cancelarReserva, reprogramarReserva } from '../../api/panel.api';
import TarjetaReserva from '../../componentes/panel/TarjetaReserva';
import ModalInfoCliente from '../../componentes/panel/ModalInfoCliente';

function PaginaReservas() {
  const [reservas, setReservas] = useState([]);
  const [estado, setEstado] = useState('cargando');
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const cargarReservas = () => {
    setEstado('cargando');
    obtenerMisReservas()
      .then((datos) => {
        setReservas(datos);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const manejarCancelar = async (id) => {
    await cancelarReserva(id);
    cargarReservas();
  };

  const manejarReprogramar = async (id, nuevaHoraInicio) => {
    await reprogramarReserva(id, nuevaHoraInicio);
    cargarReservas();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Próximas citas</h1>

      {estado === 'cargando' && <p className="mt-6 text-marble-500">Cargando agenda...</p>}
      {estado === 'error' && (
        <p className="mt-6 text-marble-500">No pudimos cargar tu agenda por ahora.</p>
      )}
      {estado === 'listo' && reservas.length === 0 && (
        <p className="mt-6 text-marble-500">No tienes citas próximas.</p>
      )}

      <div className="mt-8 grid gap-4">
        {reservas.map((reserva) => (
          <TarjetaReserva
            key={reserva.id}
            reserva={reserva}
            onVerCliente={setReservaSeleccionada}
            onCancelar={manejarCancelar}
            onReprogramar={manejarReprogramar}
          />
        ))}
      </div>

      <ModalInfoCliente
        reserva={reservaSeleccionada}
        onCerrar={() => setReservaSeleccionada(null)}
      />
    </div>
  );
}

export default PaginaReservas;
