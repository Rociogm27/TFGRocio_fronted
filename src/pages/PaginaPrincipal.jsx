import { useParams, useNavigate } from "react-router-dom";
import NavbarPer from "../navbar/navbar.js";
import PagGastos from "../gastos/gastos.js";
import PagIngresos from "../ingresos/ingresos.js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
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
  const [saldoActual, setSaldoActual] = useState('');
  const [mostrarGastos, setMostrarGastos] = useState(true);

  useEffect(() => {
    // Verificar la presencia del token en localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }


    const fetchCuentas = async () => {
      try {
        const response = await axios.get(URICuentasUser + idUser, {
          headers: {
            'auth-token': token
          }
        });
        const cuentasData = response.data;
        setCuentas(cuentasData);

        if (cuentasData.length > 0) {
          const primeraCuenta = cuentasData[0];
          setSelectedCuentaId(primeraCuenta.id);
          setSelectedCuentaNombre(primeraCuenta.nombre);
          setSaldoActual(primeraCuenta.saldo_actual);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCuentas();
  }, [idUser, navigate]);

  useEffect(() => {
    const fetchCuentaDetalles = async () => {
      if (selectedCuentaId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(URICuentaDetalle + selectedCuentaId, {
            headers: {
              'auth-token': token
            }
          });
          setSelectedCuentaNombre(response.data.nombre);
          setSaldoActual(response.data.saldo_actual);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCuentaDetalles();
  }, [selectedCuentaId]);

  const handleCuentaChange = (cuentaId, cuentaNombre) => {
    setSelectedCuentaId(cuentaId);
    setSelectedCuentaNombre(cuentaNombre);
  };

  const handleCrearCuenta = () => {
    navigate(`/${idUser}/nuevaCuenta`);
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <NavbarPer className="navbar-per" idUser={idUser} />
        </div>
      </div>
      <Container fluid className="pagina-principal">
        {cuentas.length === 0 ? (
          <Row className="justify-content-center mt-5">
            <Col md={12} className="text-center">
              <h2>Aún no posee ninguna cuenta</h2>
              <Button onClick={handleCrearCuenta} variant="success">Crear Cuenta</Button>
            </Col>
          </Row>
        ) : (
          <>
            <Row className="align-items-center mt-3 cuenta-select">
              <Col xs={12} md={3} className="d-flex justify-content-start align-items-center">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={selectedCuentaNombre ? `Cambiar cuenta` : "Seleccionar cuenta"}
                  variant="success"
                  className="custom-dropdown"
                >
                  {cuentas.map((cuenta) => (
                    <Dropdown.Item
                      key={cuenta.id}
                      onClick={() => handleCuentaChange(cuenta.id, cuenta.nombre)}
                    >
                      {cuenta.nombre}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Col>

              <Col xs={6} md={3} className="text-center">
                <h4>{selectedCuentaId ? `Cuenta: ${selectedCuentaNombre}` : 'Seleccione una cuenta'}</h4>
                <h5>{selectedCuentaId ? `Saldo: ${saldoActual}€` : ''}</h5>
              </Col>
              <Col xs={6} md={3} className="text-center mb-2">
                <Button
                  variant={mostrarGastos ? "success" : "light"}
                  className={`w-100 ${mostrarGastos ? 'activo' : 'clarito'}`}
                  onClick={() => setMostrarGastos(true)}
                >
                  Gastos
                </Button>
              </Col>
              <Col xs={6} md={3} className="text-center mb-2">
                <Button
                  variant={!mostrarGastos ? "success" : "light"}
                  className={`w-100 ${!mostrarGastos ? 'activo' : 'clarito'}`}
                  onClick={() => setMostrarGastos(false)}
                >
                  Ingresos
                </Button>
              </Col>
            </Row>
            <div class="linea"></div>

            <Row className="justify-content-center mt-3 mb-5">
              <Col xs={12}>
                <div className="detalle">
                  {selectedCuentaId ? (mostrarGastos ? <PagGastos selectedCuentaId={selectedCuentaId} /> : <PagIngresos selectedCuentaId={selectedCuentaId} />) : null}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
}

export default PaginaPrincipal;
