import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarPer from "../navbar/navbar.js";
import './sugerencias.css'; // Archivo CSS para estilos personalizados

const URISugerencias = 'http://localhost:8000/sugerencias';

const Sugerencias = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idUser } = useParams();


  useEffect(() => {
    const fetchSugerencias = async () => {
      try {
        const response = await axios.get(URISugerencias);
        setSugerencias(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sugerencias:', error);
        setLoading(false);
      }
    };

    fetchSugerencias();
  }, []);

  return (
    <div>
      <NavbarPer idUser={idUser} />
      <Container fluid className="pagina-sugerencias mt-2">
        <h1>Sugerencias</h1>
        <div class="linea"></div>

        {loading ? (
          <p>Cargando sugerencias...</p>
        ) : (
          <Row className="sugerencias-list mt-4">
            {sugerencias.length > 0 ? (
              sugerencias.map((sugerencia, index) => (
                <Col key={index} xs={12} md={6} lg={4} className="mb-4">
                  <Card className="sugerencia-card">
                    <Card.Body>
                      <Card.Title>{sugerencia.titulo}</Card.Title>
                      <Card.Text>{sugerencia.descripcion}</Card.Text>
                      <Card.Footer className="text-muted">{sugerencia.fecha}</Card.Footer>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No hay sugerencias disponibles.</p>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Sugerencias;
