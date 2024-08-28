import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cuenta.css';

const URICuentasUser = 'http://localhost:8000/cuentas/user/';
const URIGastosCuenta = 'http://localhost:8000/gastos/cuenta/';
const URIIngresosCuenta = 'http://localhost:8000/ingresos/cuenta/';
const URIGasto = 'http://localhost:8000/gastos/';
const URIIngreso = 'http://localhost:8000/ingresos/';
const URICuenta = 'http://localhost:8000/cuentas/';
const URICrearNotificacion = 'http://localhost:8000/notificaciones'; // Añadir la URL de la API de notificaciones

const Cuentas = ({ idUser }) => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cuentaToDelete, setCuentaToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [cuentaToEdit, setCuentaToEdit] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedSaldoInicial, setEditedSaldoInicial] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const token = getAuthToken();

        const response = await axios.get(URICuentasUser + idUser, {
          headers: {
            'auth-token': token
          }
        });
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

  const handleEdit = (cuenta) => {
    setCuentaToEdit(cuenta);
    setEditedName(cuenta.nombre);
    setEditedSaldoInicial(cuenta.saldo_inicial);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCuentaToEdit(null);
  };

  const handleSaveEdit = async () => {
    try {
      const token = getAuthToken();

      const updatedCuenta = {
        ...cuentaToEdit,
        nombre: editedName,
        saldo_inicial: editedSaldoInicial
      };

      await axios.put(`${URICuenta}${cuentaToEdit.id}`, updatedCuenta, {
        headers: {
          'auth-token': token
        }
      });

      setCuentas(cuentas.map(cuenta => 
        cuenta.id === cuentaToEdit.id ? updatedCuenta : cuenta
      ));
      setEditMode(false);
      setCuentaToEdit(null);
    } catch (error) {
      console.error('Error updating cuenta:', error);
    }
  };

  const handleDeleteCuenta = async () => {
    try {
      if (!cuentaToDelete) return;

      const token = getAuthToken();

      const gastosResponse = await axios.get(`${URIGastosCuenta}${cuentaToDelete.id}`, {
        headers: {
          'auth-token': token
        }
      });
      const ingresosResponse = await axios.get(`${URIIngresosCuenta}${cuentaToDelete.id}`, {
        headers: {
          'auth-token': token
        }
      });

      for (const gasto of gastosResponse.data) {
        await axios.delete(`${URIGasto}${gasto.id}`, {
          headers: {
            'auth-token': token
          }
        });
      }

      for (const ingreso of ingresosResponse.data) {
        await axios.delete(`${URIIngreso}${ingreso.id}`, {
          headers: {
            'auth-token': token
          }
        });
      }

      await axios.delete(`${URICuenta}${cuentaToDelete.id}`, {
        headers: {
          'auth-token': token
        }
      });

      // Crear una notificación para el usuario
      const notificacion = {
        usuario_id: idUser,
        mensaje: `La cuenta '${cuentaToDelete.nombre}' ha sido borrada correctamente.`,
        fecha_creacion: new Date().toISOString()
      };

      await axios.post(URICrearNotificacion, notificacion, {
        headers: {
          'auth-token': token
        }
      });

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

      <div className="linea"></div>

      <Row>
        {cuentas.length > 0 ? (
          cuentas.map((cuenta) => (
            <Col key={cuenta.id} xs={12} className='mb-4 mt-3'>
              <Card className="cuenta-card">
                <Card.Body>
                  {editMode && cuentaToEdit.id === cuenta.id ? (
                    <>
                      <Form>
                        <Form.Group controlId="formNombre">
                          <Form.Label>Nombre de la Cuenta</Form.Label>
                          <Form.Control
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group controlId="formSaldoInicial">
                          <Form.Label>Saldo Inicial</Form.Label>
                          <Form.Control
                            type="number"
                            value={editedSaldoInicial}
                            onChange={(e) => setEditedSaldoInicial(e.target.value)}
                          />
                        </Form.Group>
                      </Form>
                      <Button variant="success" onClick={handleSaveEdit} className="mt-2">Guardar</Button>
                      <Button variant="secondary" onClick={handleCancelEdit} className="mt-2 ms-2">Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Card.Title className="cuenta-card-title">{cuenta.nombre}</Card.Title>
                      <Card.Text className="cuenta-card-text">
                        Saldo Actual: {cuenta.saldo_actual}€
                      </Card.Text>
                      <Button className="btn-custom me-2" variant="custom" onClick={() => handleEdit(cuenta)}>Editar</Button>
                      <Button variant="danger" onClick={() => handleShowModal(cuenta)}>Borrar</Button>
                    </>
                  )}
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
