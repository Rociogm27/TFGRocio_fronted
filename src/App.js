import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Login from "./login/login"
import Registro from "./registro/registro"
import PagesPrincipal from "./pages/PaginaPrincipal"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/registro" element={<Registro/>}/>
          <Route path="/:idUser" element={<PagesPrincipal/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

//** */

export default App;
