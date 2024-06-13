import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Login from "./login/login"
import Registro from "./registro/registro"
import PagesPrincipal from "./pages/PaginaPrincipal"
import PagesCuenta from "./pages/PaginaCuenta"
import NuevaCuenta from "./cuentas/nuevaCuenta"
import NuevoIngreso  from './ingresos/nuevoIngreso';
import NuevoGasto from './gastos/nuevoGasto';
import Perfil from './perfil/perfil';
import Graficos from './graficas/graficas'
import Administrador from './administrador/administrador'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/registro" element={<Registro/>}/>
          <Route path="/:idUser" element={<PagesPrincipal/>}/>
          <Route path="/:idUser/cuentas" element={<PagesCuenta/>}/>
          <Route path="/:idUser/nuevaCuenta" element={<NuevaCuenta/>}/> 
          <Route path="/:idUser/nuevoIngreso/:idCuenta" element={<NuevoIngreso/>}/>
          <Route path="/:idUser/nuevoGasto/:idCuenta" element={<NuevoGasto/>}/>
          <Route path="/:idUser/perfil" element={<Perfil/>}/> 
          <Route path="/:idUser/graficos" element={<Graficos/>}/> 
          <Route path="/:idUser/notificaciones" element={<Graficos/>}/> 
          <Route path="/:idUser/administrador" element={<Administrador/>}/>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

//** */

export default App;
