import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import c3 from 'c3';
import 'c3/c3.css';
import './ingresos.css';

const URIingresosCuenta = 'http://localhost:8000/ingresos/cuenta/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';
const URIIngreso = 'http://localhost:8000/ingresos/';

const Ingresos = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null); // New state for user ID
  const [showModal, setShowModal] = useState(false);
  const [ingresoToDelete, setIngresoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const response = await axios.get(`${URIingresosCuenta}${props.selectedCuentaId}`);
        setIngresos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ingresos:', error);
        setLoading(false);
      }
    };

    const fetchCuentaDetalle = async () => {
      try {
        const response = await axios.get(`${URICuentaDetalle}${props.selectedCuentaId}`);
        setUsuarioId(response.data.usuario_id); // Set user ID from account details
      } catch (error) {
        console.error('Error fetching cuenta details:', error);
      }
    };

    fetchIngresos();
    fetchCuentaDetalle();
  }, [props.selectedCuentaId]);

  useEffect(() => {
    if (ingresos.length > 0) {
      generateDonutChart();
    }
  }, [ingresos]);

  const handleAddIngreso = () => {
    if (usuarioId) {
      navigate(`/${usuarioId}/nuevoIngreso/${props.selectedCuentaId}`);
    }
  };

  const handleShowModal = (ingreso) => {
    setIngresoToDelete(ingreso);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIngresoToDelete(null);
    setShowModal(false);
  };

  const handleDeleteIngreso = async () => {
    try {
      if (!ingresoToDelete) return;

      // Borrar el ingreso
      await axios.delete(`${URIIngreso}${ingresoToDelete.id}`);

      // Actualizar la lista de ingresos
      setIngresos(ingresos.filter(ingreso => ingreso.id !== ingresoToDelete.id));

      handleCloseModal();
    } catch (error) {
      console.error('Error deleting ingreso:', error);
    }
  };

  const generateDonutChart = () => {
    const chartData = ingresos.map(ingreso => [ingreso.descripcion, ingreso.cantidad]);

    c3.generate({
      bindto: '#donutChart',
      data: {
        columns: chartData,
        type: 'donut'
      },
      donut: {
        title: "Ingresos"
      }
    });
  };

  return (
    <div className="ingresos">
      <div className="header">
        <h2>Ingresos</h2>
        <Button variant="success" className="add-ingreso-button" onClick={handleAddIngreso}>+</Button>
      </div>
      {loading ? (
        <p>Cargando ingresos...</p>
      ) : (
        <div className="ingresos-content">
          <div className="ingresos-list">
            {ingresos.length > 0 ? (
              ingresos.map((ingreso, index) => (
                <div key={index} className="ingreso">
                  <div className="ingreso-details">
                    <p><b>Descripción: </b>{`${ingreso.descripcion}`}</p>
                    <p><b>Cantidad: </b>{`${ingreso.cantidad}`}</p>
                    <p><b>Fecha: </b>{`${ingreso.fecha}`}</p>
                  </div>
                  <Button
                    variant="light"
                    className="delete-ingreso-button"
                    onClick={() => handleShowModal(ingreso)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))
            ) : (
              <p>Aún no ha introducido ningún ingreso</p>
            )}
          </div>
          {ingresos.length > 0 && (
            <div className="grafica">
              <div id="donutChart"></div>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres borrar el ingreso de "{ingresoToDelete?.descripcion}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteIngreso}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ingresos;
