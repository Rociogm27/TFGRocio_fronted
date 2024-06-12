import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarPer from "../navbar/navbar.js";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './perfil.css';

const URIUsuario = 'http://localhost:8000/usuarios/';

const Perfil = () => {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`${URIUsuario}${idUser}`);
        setUsuario(response.data);
      } catch (error) {
        console.error('Error fetching usuario:', error);
      }
    };
    fetchUsuario();
  }, [idUser]);

  const handleCerrarSesion = () => {
    navigate(`/`);
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
                  <Card.Text>{usuario.nombreUser}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Nombre y Apellidos</Card.Title>
                  <Card.Text>{usuario.nombre}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Email</Card.Title>
                  <Card.Text>{usuario.email}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="perfil-card">
                <Card.Body>
                  <Card.Title>Contraseña</Card.Title>
                  <Card.Text>{ocultarContrasena(usuario.contrasena)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <Row className="justify-content-center mt-4">
          <Col md={6} xs={12}>
            <Button variant="danger" onClick={handleCerrarSesion} className="w-100">Cerrar Sesión</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Perfil;
