import { NavLink, Outlet } from 'react-router-dom';
import { useAutenticacion } from '../../contexto/ContextoAutenticacion';

const ENLACES_NAV = [
  { to: '/panel', label: 'Agenda', fin: true },
  { to: '/panel/horario-laboral', label: 'Horarios' },
];

function PaginaTablero() {
  const { usuario, cerrarSesion } = useAutenticacion();

  return (
    <div className="bg-marble min-h-screen">
      <header className="border-b border-marble-200 bg-marble-50">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-accent text-xs tracking-greek text-marble-500 uppercase">
              Peluquería 1 · Panel
            </p>
            {usuario && <p className="font-sans text-sm text-ink">{usuario.nombreCompleto}</p>}
          </div>

          <div className="flex items-center gap-6 font-sans text-xs tracking-greek uppercase">
            {ENLACES_NAV.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                end={enlace.fin}
                className={({ isActive }) =>
                  isActive ? 'text-ink underline' : 'text-marble-500 hover:text-ink'
                }
              >
                {enlace.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={cerrarSesion}
              className="text-marble-500 uppercase hover:text-ink"
            >
              Cerrar sesión
            </button>
          </div>
        </nav>
      </header>

      {usuario?.esDemo && (
        <div className="border-b border-marble-200 bg-ink px-6 py-2 text-center font-sans text-xs tracking-greek text-marble-50 uppercase">
          Modo demo · los datos se reinician cada 24 horas
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}

export default PaginaTablero;
