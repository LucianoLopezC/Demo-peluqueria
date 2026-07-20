import SeccionMarmol from '../comunes/SeccionMarmol';
import TituloSerif from '../comunes/TituloSerif';
import fotoCorteClasico from '../../assets/galeria/corte-clasico.jpg';
import fotoColorMechas from '../../assets/galeria/color-mechas.jpg';
import fotoBarba from '../../assets/galeria/barba.jpg';
import fotoEstilismoEvento from '../../assets/galeria/estilismo-evento.jpg';

const PIEZAS = [
  { titulo: 'Corte clásico', foto: fotoCorteClasico },
  { titulo: 'Color y mechas', foto: fotoColorMechas },
  { titulo: 'Barba', foto: fotoBarba },
  { titulo: 'Estilismo de evento', foto: fotoEstilismoEvento },
];

function Galeria() {
  return (
    <SeccionMarmol id="trabajos" fondo="blanco">
      <TituloSerif antetitulo="Nuestro trabajo">El espacio</TituloSerif>
      <div className="grid grid-cols-2 items-end gap-5 sm:grid-cols-4">
        {PIEZAS.map((pieza, indice) => (
          <div
            key={pieza.titulo}
            className={`overflow-hidden border border-ink/10 ${
              indice % 2 === 0 ? 'arco h-72' : 'h-56'
            }`}
          >
            <img src={pieza.foto} alt={pieza.titulo} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </SeccionMarmol>
  );
}

export default Galeria;
