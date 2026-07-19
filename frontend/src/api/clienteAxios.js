import axios from 'axios';
import { obtenerTokenAcceso, establecerTokenAcceso } from './tokenAutenticacion';

const URL_BASE_API = import.meta.env.VITE_URL_BASE_API || 'http://localhost:4000/api';

const clienteAxios = axios.create({
  baseURL: URL_BASE_API,
  withCredentials: true,
});

function leerCookie(nombre) {
  const coincidencia = document.cookie.match(new RegExp(`(?:^|; )${nombre}=([^;]*)`));
  return coincidencia ? decodeURIComponent(coincidencia[1]) : null;
}

clienteAxios.interceptors.request.use((config) => {
  const tokenCsrf = leerCookie('tokenCsrf');
  if (tokenCsrf) {
    config.headers['x-token-csrf'] = tokenCsrf;
  }

  const tokenAcceso = obtenerTokenAcceso();
  if (tokenAcceso) {
    config.headers.Authorization = `Bearer ${tokenAcceso}`;
  }

  return config;
});

// Ante un 401 en una request del panel, intenta renovar el token de acceso
// una vez (la cookie de refresco es httpOnly y se envía automáticamente) y
// reintenta la request.
let promesaRenovacion = null;

clienteAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (
      !response ||
      response.status !== 401 ||
      config._reintentado ||
      config.url === '/autenticacion/renovar'
    ) {
      return Promise.reject(error);
    }

    config._reintentado = true;

    try {
      promesaRenovacion =
        promesaRenovacion ||
        axios.post(`${URL_BASE_API}/autenticacion/renovar`, {}, { withCredentials: true });

      const { data } = await promesaRenovacion;
      establecerTokenAcceso(data.tokenAcceso);
      return clienteAxios(config);
    } catch (errorRenovacion) {
      establecerTokenAcceso(null);
      return Promise.reject(errorRenovacion);
    } finally {
      promesaRenovacion = null;
    }
  },
);

export default clienteAxios;
