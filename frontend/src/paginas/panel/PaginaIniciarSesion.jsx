import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contexto/ContextoAutenticacion';
import Boton from '../../componentes/comunes/Boton';

function PaginaIniciarSesion() {
  const { iniciarSesion } = useAutenticacion();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [estado, setEstado] = useState('inactivo');

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setEstado('cargando');
    setError('');

    try {
      await iniciarSesion(correo, contrasena);
      navigate('/panel');
    } catch (_err) {
      setEstado('inactivo');
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="bg-marble flex min-h-screen items-center justify-center px-6">
      <form onSubmit={manejarEnvio} className="w-full max-w-sm border border-marble-300 p-10">
        <p className="text-center font-accent text-xs tracking-greek text-marble-500 uppercase">
          Peluquería 1
        </p>
        <h1 className="mt-4 text-center font-display text-3xl text-ink">Panel de profesionales</h1>

        <label className="mt-8 grid gap-2 font-sans text-sm text-marble-700">
          Email
          <input
            required
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="border border-marble-300 bg-marble-50 px-4 py-3 text-ink"
          />
        </label>

        <label className="mt-4 grid gap-2 font-sans text-sm text-marble-700">
          Contraseña
          <input
            required
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="border border-marble-300 bg-marble-50 px-4 py-3 text-ink"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <Boton type="submit" className="mt-8 w-full" disabled={estado === 'cargando'}>
          {estado === 'cargando' ? 'Ingresando...' : 'Ingresar'}
        </Boton>
      </form>
    </div>
  );
}

export default PaginaIniciarSesion;
