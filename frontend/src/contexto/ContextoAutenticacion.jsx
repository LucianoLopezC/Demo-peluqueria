import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  iniciarSesion as solicitarInicioSesion,
  cerrarSesion as solicitarCierreSesion,
  renovarSesion,
} from '../api/autenticacion.api';
import { establecerTokenAcceso } from '../api/tokenAutenticacion';

const ContextoAutenticacion = createContext(null);

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estado, setEstado] = useState('cargando'); // cargando | autenticado | no_autenticado

  useEffect(() => {
    renovarSesion()
      .then(({ tokenAcceso, usuario: usuarioSesion }) => {
        establecerTokenAcceso(tokenAcceso);
        setUsuario(usuarioSesion);
        setEstado('autenticado');
      })
      .catch(() => {
        establecerTokenAcceso(null);
        setEstado('no_autenticado');
      });
  }, []);

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const { tokenAcceso, usuario: usuarioIngresado } = await solicitarInicioSesion(
      correo,
      contrasena,
    );
    establecerTokenAcceso(tokenAcceso);
    setUsuario(usuarioIngresado);
    setEstado('autenticado');
  }, []);

  const cerrarSesion = useCallback(async () => {
    await solicitarCierreSesion().catch(() => {});
    establecerTokenAcceso(null);
    setUsuario(null);
    setEstado('no_autenticado');
  }, []);

  return (
    <ContextoAutenticacion.Provider value={{ usuario, estado, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de un ProveedorAutenticacion');
  }
  return contexto;
}
