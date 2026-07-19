import Portada from '../../componentes/publico/Portada';
import QuienesSomos from '../../componentes/publico/QuienesSomos';
import Equipo from '../../componentes/publico/Equipo';
import Galeria from '../../componentes/publico/Galeria';
import ListaPrecios from '../../componentes/publico/ListaPrecios';
import FormularioReserva from '../../componentes/publico/FormularioReserva';

const ENLACES_NAV = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#trabajos', label: 'Trabajos' },
  { href: '#servicios', label: 'Servicios' },
];

function PaginaInicio() {
  return (
    <>
      <header className="bg-marble-50/90 sticky top-0 z-10 border-b border-ink/8 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-16">
          <a href="#inicio" className="font-display text-xl tracking-[0.3em] text-ink uppercase">
            Peluquería 1
          </a>
          <ul className="hidden gap-9 font-sans text-xs tracking-greek text-marble-700 uppercase md:flex">
            {ENLACES_NAV.map((enlace) => (
              <li key={enlace.href}>
                <a href={enlace.href} className="transition-colors hover:text-marble-500">
                  {enlace.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#reservar"
            className="border border-ink px-6 py-2.5 font-sans text-xs tracking-greek uppercase transition-colors hover:bg-ink hover:text-marble-50"
          >
            Reservar
          </a>
        </nav>
      </header>

      <main id="inicio">
        <Portada />
        <div className="greca" />
        <QuienesSomos />
        <Equipo />
        <Galeria />
        <ListaPrecios />
        <FormularioReserva />
      </main>

      <footer className="bg-ink px-6 py-12 text-center text-marble-300">
        <p className="font-display text-xl tracking-[0.3em] text-marble-50 uppercase">
          Peluquería 1
        </p>
        <p className="mt-3 font-sans text-xs tracking-greek uppercase">
          Cortes · Color · Estilismo
        </p>
        <div className="greca-clara mx-auto mt-6 max-w-xs" />
      </footer>
    </>
  );
}

export default PaginaInicio;
