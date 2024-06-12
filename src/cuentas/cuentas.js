import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cuenta.css';

const URICuentasUser = 'http://localhost:8000/cuentas/user/';

const Cuentas = ({ idUser }) => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);

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
      <Row>
        {cuentas.length > 0 ? (
          cuentas.map((cuenta) => (
            <Col key={cuenta.id} xs={12} className='mb-4'>
              <Card className="cuenta-card">
                <Card.Body>
                  <Card.Title className="cuenta-card-title">{cuenta.nombre}</Card.Title>
                  <Card.Text className="cuenta-card-text">
                    Saldo Actual: {cuenta.saldo_actual}€
                  </Card.Text>
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
    </Container>
  );
};

export default Cuentas;
