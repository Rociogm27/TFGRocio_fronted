import { useParams } from "react-router-dom";
import NavbarPer from "../navbar/navbar.js";
import React from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cuentas from "../cuentas/cuentas.js";

function PaginaCuenta() {
  const { idUser } = useParams();

  return (
    <div>
    <NavbarPer idUser={idUser}></NavbarPer>
    <div className="container-fluid h-100">
        <div className="row">
            <div className="col">
                <Cuentas idUser={idUser}></Cuentas>
            </div>
        </div>
    </div>
</div>
  );

}

export default PaginaCuenta;