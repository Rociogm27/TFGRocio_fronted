import { useParams, useNavigate } from "react-router-dom";
import NavbarPer from "../navbar/navbar.js";
import PagGastos from "../gastos/gastos.js";
import PagIngresos from "../ingresos/ingresos.js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PaginaPrincipal.css';

const URICuentasUser = 'http://localhost:8000/cuentas/user/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';

function PaginaPrincipal() {
  const { idUser } = useParams();
  const navigate = useNavigate();

  const [cuentas, setCuentas] = useState([]);
  const [selectedCuentaId, setSelectedCuentaId] = useState(null);
  const [selectedCuentaNombre, setSelectedCuentaNombre] = useState('');
  const [mostrarGastos, setMostrarGastos] = useState(true);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get(URICuentasUser + idUser);
        setCuentas(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCuentas();
  }, [idUser]);

  useEffect(() => {
    const fetchCuentaNombre = async () => {
      if (selectedCuentaId) {
        try {
          const response = await axios.get(URICuentaDetalle + selectedCuentaId);
          setSelectedCuentaNombre(response.data.nombre);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCuentaNombre();
  }, [selectedCuentaId]);

  const handleCuentaChange = (event) => {
    setSelectedCuentaId(event.target.value);
    setSelectedCuentaNombre('');
  };

  const handleCrearCuenta = () => {
    navigate(`/${idUser}/cuentas`);
  };

  return (
    <Container fluid className="pagina-principal">
      <NavbarPer idUser={idUser} />
      <div className="container-fluid h-100">
        <div className="row">
          {cuentas.length === 0 ? (
            <Row className="justify-content-center mt-5">
              <Col md={12} className="text-center">
                <h2>Aún no posee ninguna cuenta</h2>
                <Button onClick={handleCrearCuenta} variant="success">Crear Cuenta</Button>
              </Col>
            </Row>
          ) : (
            <>
              <Row className="justify-content-start mt-3 cuenta-select">
                <Col xs={12} md={8}>
                  <Form.Group>
                    <Form.Control as="select" value={selectedCuentaId} onChange={handleCuentaChange}>
                      <option value="">Seleccionar cuenta</option>
                      {cuentas.map((cuenta) => (
                        <option key={cuenta.id} value={cuenta.id}>
                          {cuenta.nombre}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-center mt-3">
                <Col xs={12} md={8} className="text-center">
                  <h1>
                    {selectedCuentaId ? `Cuenta: ${selectedCuentaNombre}` : 'Seleccione una cuenta'}
                  </h1>
                </Col>
              </Row>

              {selectedCuentaId && (
                <Row className="justify-content-center mt-3 botones">
                  <Col xs={6} md={4} className="text-center mb-2">
                    <Button
                      variant={mostrarGastos ? "success" : "outline-secondary"}
                      className={`w-100 ${mostrarGastos ? 'activo' : ''}`}
                      onClick={() => setMostrarGastos(true)}
                    >
                      Gastos
                    </Button>
                  </Col>
                  <Col xs={6} md={4} className="text-center mb-2">
                    <Button
                      variant={!mostrarGastos ? "success" : "outline-secondary"}
                      className={`w-100 ${!mostrarGastos ? 'activo' : ''}`}
                      onClick={() => setMostrarGastos(false)}
                    >
                      Ingresos
                    </Button>
                  </Col>
                </Row>
              )}
        
              <Row className="justify-content-center mt-3">
                <Col xs={12} md={8}>
                  <div className="detalle">
                    {selectedCuentaId ? (mostrarGastos ? <PagGastos selectedCuentaId={selectedCuentaId} /> : <PagIngresos selectedCuentaId={selectedCuentaId} />) : null}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}





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
*/
export default PaginaPrincipal;