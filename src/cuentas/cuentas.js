import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cuenta.css';

const URICuentasUser = 'http://localhost:8000/cuentas/user/';
const URIGastosCuenta = 'http://localhost:8000/gastos/cuenta/';
const URIIngresosCuenta = 'http://localhost:8000/ingresos/cuenta/';
const URIGasto = 'http://localhost:8000/gastos/';
const URIIngreso = 'http://localhost:8000/ingresos/';
const URICuenta = 'http://localhost:8000/cuentas/';

const Cuentas = ({ idUser }) => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cuentaToDelete, setCuentaToDelete] = useState(null);

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

  const handleAddCuenta = () => {
    navigate(`/${idUser}/nuevaCuenta`);
  };

  const handleShowModal = (cuenta) => {
    setCuentaToDelete(cuenta);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCuentaToDelete(null);
    setShowModal(false);
  };

  const handleDeleteCuenta = async () => {
    try {
      if (!cuentaToDelete) return;

      const gastosResponse = await axios.get(`${URIGastosCuenta}${cuentaToDelete.id}`);
      const ingresosResponse = await axios.get(`${URIIngresosCuenta}${cuentaToDelete.id}`);

      // Borrar todos los gastos de la cuenta
      for (const gasto of gastosResponse.data) {
        await axios.delete(`${URIGasto}${gasto.id}`);
      }

      // Borrar todos los ingresos de la cuenta
      for (const ingreso of ingresosResponse.data) {
        await axios.delete(`${URIIngreso}${ingreso.id}`);
      }

      // Borrar la cuenta
      await axios.delete(`${URICuenta}${cuentaToDelete.id}`);

      // Actualizar la lista de cuentas
      setCuentas(cuentas.filter(cuenta => cuenta.id !== cuentaToDelete.id));

      handleCloseModal();
    } catch (error) {
      console.error('Error deleting cuenta:', error);
    }
  };

  return (
    <Container fluid className="pagina-cuentas">
      <Row className="cuentas-header">
        <Col>
          <h1>Cuentas</h1>
        </Col>
        <Col className="text-end">
          <Button className="add-cuenta-button" onClick={handleAddCuenta}>+</Button>
        </Col>
      </Row>

            <div class="linea"></div>

      <Row>
        {cuentas.length > 0 ? (
          cuentas.map((cuenta) => (
            <Col key={cuenta.id} xs={12} className='mb-4 mt-3'>
              <Card className="cuenta-card">
                <Card.Body>
                  <Card.Title className="cuenta-card-title">{cuenta.nombre}</Card.Title>
                  <Card.Text className="cuenta-card-text">
                    Saldo Actual: {cuenta.saldo_actual}€
                  </Card.Text>
                  <Button variant="danger" onClick={() => handleShowModal(cuenta)}>Borrar</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12} className='mb-4'>
            <Card className="cuenta-card">
              <Card.Body>
                <Card.Title className="cuenta-card-title">Aún no hay ninguna cuenta</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres borrar la cuenta "{cuentaToDelete?.nombre}"? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteCuenta}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cuentas;
