import { useEffect, useState } from 'react';
import SeccionMarmol from '../comunes/SeccionMarmol';
import TituloSerif from '../comunes/TituloSerif';
import { obtenerProfesionales } from '../../api/profesionales.api';

function Equipo() {
  const [profesionales, setProfesionales] = useState([]);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    obtenerProfesionales()
      .then((datos) => {
        setProfesionales(datos);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, []);

  return (
    <SeccionMarmol id="equipo">
      <TituloSerif antetitulo="El equipo">Las manos detrás del oficio</TituloSerif>

      {estado === 'error' && (
        <p className="text-center text-marble-500">No pudimos cargar el equipo por ahora.</p>
      )}

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {profesionales.map((profesional) => (
          <div key={profesional.id} className="text-center">
            <div className="arco-sm bg-marble-200 mx-auto flex h-60 w-48 items-center justify-center overflow-hidden border border-ink/10">
              {profesional.urlFoto ? (
                <img
                  src={profesional.urlFoto}
                  alt={profesional.nombreCompleto}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-3xl text-marble-500">
                  {profesional.nombreCompleto.charAt(0)}
                </span>
              )}
            </div>
            <h3 className="mt-6 font-display text-xl text-ink">{profesional.nombreCompleto}</h3>
            {profesional.biografia && (
              <p className="mt-1.5 font-sans text-xs tracking-greek text-marble-500 uppercase">
                {profesional.biografia}
              </p>
            )}
          </div>
        ))}
      </div>
    </SeccionMarmol>
  );
}

export default Equipo;
