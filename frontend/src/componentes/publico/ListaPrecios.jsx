import { useEffect, useState } from 'react';
import SeccionMarmol from '../comunes/SeccionMarmol';
import TituloSerif from '../comunes/TituloSerif';
import { obtenerServicios } from '../../api/servicios.api';

function formatearPrecio(centavos) {
  return (centavos / 100).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

const ETIQUETAS_CATEGORIA = {
  BARBERIA: 'Barbería',
  ESTETICA: 'Estética',
};

function Columna({ titulo, servicios }) {
  return (
    <div>
      <div className="mb-7 flex items-center gap-4">
        <span className="font-display text-lg tracking-[0.3em] text-ink uppercase">{titulo}</span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <ul className="flex flex-col">
        {servicios.map((servicio) => (
          <li
            key={servicio.id}
            className="flex items-baseline justify-between gap-5 border-b border-ink/10 py-4.5"
          >
            <div>
              <div className="font-sans text-[17px] text-ink">{servicio.nombre}</div>
              {servicio.descripcion && (
                <div className="mt-1 font-sans text-[13px] font-light text-marble-500">
                  {servicio.descripcion}
                </div>
              )}
            </div>
            <div className="font-display text-lg whitespace-nowrap text-ink">
              {formatearPrecio(servicio.precioCentavos)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListaPrecios() {
  const [servicios, setServicios] = useState([]);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    obtenerServicios()
      .then((datos) => {
        setServicios(datos);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, []);

  const porCategoria = (categoria) => servicios.filter((s) => s.categoria === categoria);

  return (
    <SeccionMarmol id="servicios">
      <TituloSerif antetitulo="Nuestros servicios">Ritual y precisión.</TituloSerif>

      {estado === 'error' && (
        <p className="text-center text-marble-500">No pudimos cargar los servicios por ahora.</p>
      )}

      <div className="grid gap-16 md:grid-cols-2">
        {Object.entries(ETIQUETAS_CATEGORIA).map(([categoria, titulo]) => {
          const serviciosCategoria = porCategoria(categoria);
          if (serviciosCategoria.length === 0) return null;
          return <Columna key={categoria} titulo={titulo} servicios={serviciosCategoria} />;
        })}
      </div>
    </SeccionMarmol>
  );
}

export default ListaPrecios;
