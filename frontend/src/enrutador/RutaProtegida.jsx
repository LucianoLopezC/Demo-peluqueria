import { Navigate, Outlet } from 'react-router-dom';
import { useAutenticacion } from '../contexto/ContextoAutenticacion';

function RutaProtegida() {
  const { estado } = useAutenticacion();

  if (estado === 'cargando') {
    return (
      <div className="bg-marble flex min-h-screen items-center justify-center">
        <p className="font-sans text-marble-500">Cargando...</p>
      </div>
    );
  }

  if (estado === 'no_autenticado') {
    return <Navigate to="/panel/iniciar-sesion" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
