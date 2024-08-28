import './App.css';
import { BrowserRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import Login from "./login/login";
import Registro from "./registro/registro";
import PagesPrincipal from "./pages/PaginaPrincipal";
import PagesCuenta from "./pages/PaginaCuenta";
import NuevaCuenta from "./cuentas/nuevaCuenta";
import NuevoIngreso from './ingresos/nuevoIngreso';
import NuevoGasto from './gastos/nuevoGasto';
import Perfil from './perfil/perfil';
import Graficos from './graficas/graficas';
import Administrador from './administrador/administrador';
import Notificiones from './notificaciones/notificaciones';
import Sugerencias from './sugerencias/sugerencias'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const usuariologueado = localStorage.getItem('idUser');
  const { idUser } = useParams();  // Obtiene el idUser de la URL

  // Si no hay token, redirigir a la página de inicio
  if (!token) {
    return <Navigate to="/" />;
  }
  // Si hay token pero el idUser no coincide, redirigir a la página del usuario logueado
  if (idUser !== usuariologueado) {
    return <Navigate to={`/${usuariologueado}`} />;
  }
  // Si todo está bien, renderizar el componente hijo
  return children;
};


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/:idUser" element={<ProtectedRoute><PagesPrincipal /></ProtectedRoute>} />
          <Route path="/:idUser/cuentas" element={<ProtectedRoute><PagesCuenta /></ProtectedRoute>} />
          <Route path="/:idUser/nuevaCuenta" element={<ProtectedRoute><NuevaCuenta /></ProtectedRoute>} />
          <Route path="/:idUser/nuevoIngreso/:idCuenta" element={<ProtectedRoute><NuevoIngreso /></ProtectedRoute>} />
          <Route path="/:idUser/nuevoGasto/:idCuenta" element={<ProtectedRoute><NuevoGasto /></ProtectedRoute>} />
          <Route path="/:idUser/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/:idUser/graficos" element={<ProtectedRoute><Graficos /></ProtectedRoute>} />
          <Route path="/:idUser/notificaciones" element={<ProtectedRoute><Notificiones /></ProtectedRoute>} />
          <Route path="/:idUser/administrador" element={<ProtectedRoute><Administrador /></ProtectedRoute>} />
          <Route path="/:idUser/sugerencias" element={<ProtectedRoute><Sugerencias /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
