import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import NavbarPer from "../navbar/navbar.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import './notificaciones.css';

const URINotificaciones = 'http://localhost:8000/notificaciones/user/';
const URINotificacion = 'http://localhost:8000/notificaciones/';

const Notificiones = () => {
  const { idUser } = useParams();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notificacionToDelete, setNotificacionToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${URINotificaciones}${idUser}`, {
          headers: {
            'auth-token': token
          }
        });
        console.log('Response:', response.data);  // Verificar la respuesta
        setNotificaciones(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notificaciones:', error);
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, [idUser]);

  const handleShowModal = (notificacion) => {
    setNotificacionToDelete(notificacion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setNotificacionToDelete(null);
    setShowModal(false);
  };

  const handleDeleteNotificacion = async () => {
    try {
      if (!notificacionToDelete) return;

      // Borrar la notificación
      await axios.delete(`${URINotificacion}${notificacionToDelete.id}`);

      // Actualizar la lista de notificaciones
      setNotificaciones(notificaciones.filter(notificacion => notificacion.id !== notificacionToDelete.id));

      handleCloseModal();
    } catch (error) {
      console.error('Error deleting notificacion:', error);
    }
  };

  return (
    <div className="notificaciones">
      <NavbarPer idUser={idUser} />
      <div className="header">
        <h1>Notificaciones</h1>
        <div class="linea"></div>

      </div>

      {loading ? (
        <p>Cargando notificaciones...</p>
      ) : (
        <div className="notificaciones-content mt-4">
          <div className="notificaciones-list">
            {notificaciones.length > 0 ? (
              notificaciones.map((notificacion, index) => (
                <div key={index} className="notificacion">
                  <div className="notificacion-details">
                    <p><b>Mensaje: </b>{notificacion.mensaje}</p>
                    <p><b>Fecha: </b>{notificacion.fecha_creacion}</p>
                  </div>
                  <Button
                    variant="light"
                    className="delete-notificacion-button"
                    onClick={() => handleShowModal(notificacion)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))
            ) : (
              <p>No tienes ninguna notificación</p>
            )}
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres borrar la notificación: "{notificacionToDelete?.mensaje}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteNotificacion}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Notificiones;
