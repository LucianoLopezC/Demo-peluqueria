import SeccionMarmol from '../comunes/SeccionMarmol';
import TituloSerif from '../comunes/TituloSerif';

const PIEZAS = ['Corte clásico', 'Color y mechas', 'Barba', 'Estilismo de evento'];

function Galeria() {
  return (
    <SeccionMarmol id="trabajos" fondo="blanco">
      <TituloSerif antetitulo="Nuestro trabajo">El espacio</TituloSerif>
      <div className="grid grid-cols-2 items-end gap-5 sm:grid-cols-4">
        {PIEZAS.map((pieza, indice) => (
          <div
            key={pieza}
            className={`bg-marble flex items-center justify-center overflow-hidden border border-ink/10 ${
              indice % 2 === 0 ? 'arco h-72' : 'h-56'
            }`}
          >
            <span className="px-4 text-center font-sans text-xs tracking-greek text-marble-500 uppercase">
              {pieza}
            </span>
          </div>
        ))}
      </div>
    </SeccionMarmol>
  );
}

export default Galeria;
