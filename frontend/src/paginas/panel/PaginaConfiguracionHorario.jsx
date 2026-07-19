import { useEffect, useState } from 'react';
import { obtenerMiHorarioLaboral, actualizarMiHorarioLaboral } from '../../api/panel.api';
import EditorHorarioLaboral from '../../componentes/panel/EditorHorarioLaboral';

function PaginaConfiguracionHorario() {
  const [dias, setDias] = useState(null);
  const [estado, setEstado] = useState('cargando');
  const [estadoGuardado, setEstadoGuardado] = useState('inactivo');

  useEffect(() => {
    obtenerMiHorarioLaboral()
      .then((datos) => {
        setDias(datos);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, []);

  const manejarGuardar = async (diasActualizados) => {
    setEstadoGuardado('cargando');
    try {
      await actualizarMiHorarioLaboral(diasActualizados);
      setEstadoGuardado('exito');
    } catch (_err) {
      setEstadoGuardado('error');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Mi horario de trabajo</h1>
      <p className="mt-2 font-sans text-sm text-marble-500">
        Define los días y horas en los que aceptas reservas. Este horario alimenta el calendario
        público.
      </p>

      {estado === 'cargando' && <p className="mt-6 text-marble-500">Cargando horario...</p>}
      {estado === 'error' && (
        <p className="mt-6 text-marble-500">No pudimos cargar tu horario por ahora.</p>
      )}

      {estado === 'listo' && (
        <div className="mt-8">
          <EditorHorarioLaboral
            diasIniciales={dias}
            onGuardar={manejarGuardar}
            guardando={estadoGuardado === 'cargando'}
          />
          {estadoGuardado === 'exito' && (
            <p className="mt-4 text-sm text-green-700">Horario actualizado.</p>
          )}
          {estadoGuardado === 'error' && (
            <p className="mt-4 text-sm text-red-700">No pudimos guardar el horario.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PaginaConfiguracionHorario;
