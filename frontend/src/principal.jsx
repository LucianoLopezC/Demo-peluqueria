import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilos/global.css';
import Aplicacion from './Aplicacion.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
);
