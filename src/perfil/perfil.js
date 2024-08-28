import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarPer from "../navbar/navbar.js";
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './perfil.css';

const URIUsuario = 'http://localhost:8000/usuarios/';

const Perfil = () => {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombreUser: '',
    nombre: '',
    email: '',
    contrasena: ''
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${URIUsuario}${idUser}`, {
          headers: {
            'auth-token': token
          }
        });
        setUsuario(response.data);
        setFormData({
          nombreUser: response.data.nombreUser,
          nombre: response.data.nombre,
          email: response.data.email,
          contrasena: response.data.contrasena
        });
      } catch (error) {
        console.error('Error fetching usuario:', error);
      }
    };
    fetchUsuario();
  }, [idUser]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');  // Elimina el token del almacenamiento local
    localStorage.removeItem('idUser');  // Elimina el user del almacenamiento local
    navigate(`/`);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    setShowModal(true);
  };

  const confirmSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${URIUsuario}${idUser}`, formData, {
        headers: {
          'auth-token': token
        }
      });
      setUsuario(formData);
      setEditMode(false);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating usuario:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      nombreUser: usuario.nombreUser,
      nombre: usuario.nombre,
      email: usuario.email,
      contrasena: usuario.contrasena
    });
  };

  const ocultarContrasena = (contrasena) => {
    return '*'.repeat(contrasena.length);
  };

  return (
    <div className="perfil-container">
      <NavbarPer idUser={idUser} />
      <Container className="perfil-box">
        <Row>
          <Col>
            <h1>Perfil de Usuario</h1>
          </Col>
        </Row>
        {usuario && (
          <Row className="perfil-info">
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Nombre de Usuario</Card.Title>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="nombreUser"
                      value={formData.nombreUser}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Card.Text>{usuario.nombreUser}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Nombre y Apellidos</Card.Title>
                  {editMode ? (
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Card.Text>{usuario.nombre}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Email</Card.Title>
                  {editMode ? (
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Card.Text>{usuario.email}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Contraseña</Card.Title>
                  {editMode ? (
                    <Form.Control
                      type="password"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <Card.Text>{ocultarContrasena(usuario.contrasena)}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <Row className="justify-content-center mt-4">
          <Col md={12} xs={12} className="button-group">
            {editMode ? (
              <>
                <Button variant="success" onClick={handleSave} className="btn mb-2">Guardar Cambios</Button>
                <Button variant="secondary" onClick={handleCancel} className="btn mb-2">Cancelar</Button>
              </>
            ) : (
              <>
                <Button variant="custom" onClick={handleEdit} className="btn custom mb-2">Editar Perfil</Button>
                <Button variant="danger" onClick={handleCerrarSesion} className="btn mb-2">Cerrar Sesión</Button>
              </>
            )}
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Cambios</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que quieres guardar los cambios?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary"  onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary"  onClick={confirmSave}>Guardar Cambios</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Perfil;
