import { useParams } from "react-router-dom";
import NavbarPer from "../navbar/navbar.js";
import PagGastos from "../gastos/gastos.js";
import PagIngresos from "../ingresos/ingresos.js";
import React, { useState } from 'react';
import './PaginaPrincipal.css';

const PaginaPrincipal = () => {
  const { idUser } = useParams();
  const [mostrarGastos, setMostrarGastos] = useState(true);

  return (
    <div className="pagina-principal">
      <NavbarPer idUser={idUser} />
      <div className="contenido">
        <div className="botones">
          <button className={`boton-toggle ${mostrarGastos ? 'activo' : ''}`} onClick={() => setMostrarGastos(true)}>Gastos</button>
          <button className={`boton-toggle ${!mostrarGastos ? 'activo' : ''}`} onClick={() => setMostrarGastos(false)}>Ingresos</button>
        </div>
        <div className="cuenta-principal-contenedor">
          <div className="cuenta-principal">
            <h2>Cuenta Principal</h2>
          </div>
          <div className="totales">
            <h2>Total: XX€</h2>
          </div>
        </div>
        <div className="filtros">
          <a href="#">Día</a>
          <a href="#">Semana</a>
          <a href="#">Mes</a>
        </div>
        <div className="fecha">
          <h3>Mayo de 2024</h3>
        </div>
        <div className="detalle">
          {mostrarGastos ? <PagGastos /> : <PagIngresos />}
        </div>
      </div>
    </div>
  );
};

/*
function PaginaPrincipal () {
    const {idUser} = useParams()

    return(
        <div>
            <NavbarPer idUser={idUser}></NavbarPer>
            <div>
            <PagGastos></PagGastos>
             </div>
             <div>
            <PagIngresos></PagIngresos>
             </div>
        </div>
    )
}
*/
export default PaginaPrincipal;