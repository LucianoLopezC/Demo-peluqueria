import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorAutenticacion } from '../contexto/ContextoAutenticacion';
import RutaProtegida from './RutaProtegida';
import PaginaInicio from '../paginas/publico/PaginaInicio';
import PaginaIniciarSesion from '../paginas/panel/PaginaIniciarSesion';
import PaginaTablero from '../paginas/panel/PaginaTablero';
import PaginaReservas from '../paginas/panel/PaginaReservas';
import PaginaConfiguracionHorario from '../paginas/panel/PaginaConfiguracionHorario';

function EnrutadorApp() {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        <Routes>
          <Route path="/" element={<PaginaInicio />} />
          <Route path="/panel/iniciar-sesion" element={<PaginaIniciarSesion />} />

          <Route element={<RutaProtegida />}>
            <Route path="/panel" element={<PaginaTablero />}>
              <Route index element={<PaginaReservas />} />
              <Route path="horario-laboral" element={<PaginaConfiguracionHorario />} />
            </Route>
          </Route>
        </Routes>
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
}

export default EnrutadorApp;
