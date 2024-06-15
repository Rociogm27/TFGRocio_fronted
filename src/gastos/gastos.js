import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import c3 from 'c3';
import 'c3/c3.css';
import './gastos.css';

const URIgastosCuenta = 'http://localhost:8000/gastos/cuenta/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';
const URIGasto = 'http://localhost:8000/gastos/';

const Gastos = (props) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null); // New state for user ID
  const [showModal, setShowModal] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await axios.get(`${URIgastosCuenta}${props.selectedCuentaId}`);
        setGastos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gastos:', error);
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

    fetchGastos();
    fetchCuentaDetalle();
  }, [props.selectedCuentaId]);

  useEffect(() => {
    if (gastos.length > 0) {
      generateDonutChart();
    }
  }, [gastos]);

  const handleAddGasto = () => {
    if (usuarioId) {
      navigate(`/${usuarioId}/nuevoGasto/${props.selectedCuentaId}`);
    }
  };

  const handleShowModal = (gasto) => {
    setGastoToDelete(gasto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setGastoToDelete(null);
    setShowModal(false);
  };

  const handleDeleteGasto = async () => {
    try {
      if (!gastoToDelete) return;

      // Borrar el gasto
      await axios.delete(`${URIGasto}${gastoToDelete.id}`);

      // Actualizar la lista de gastos
      setGastos(gastos.filter(gasto => gasto.id !== gastoToDelete.id));

      handleCloseModal();
    } catch (error) {
      console.error('Error deleting gasto:', error);
    }
  };

  const generateDonutChart = () => {
    const chartData = gastos.map(gasto => [gasto.descripcion, gasto.cantidad]);

    c3.generate({
      bindto: '#donutChart',
      data: {
        columns: chartData,
        type: 'donut'
      },
      donut: {
        title: "Gastos"
      }
    });
  };

  return (
    <div className="gastos">
      <div className="header">
        <h2>Gastos</h2>
        <Button variant="success" className="add-gasto-button" onClick={handleAddGasto}>+</Button>
      </div>
      {loading ? (
        <p>Cargando gastos...</p>
      ) : (
        <div className="gastos-content">
          <div className="gastos-list">
            {gastos.length > 0 ? (
              gastos.map((gasto, index) => (
                <div key={index} className="gasto">
                  <div className="gasto-details">
                    <p><b>Descripción: </b>{`${gasto.descripcion}`}</p>
                    <p><b>Cantidad: </b>{`${gasto.cantidad}`}</p>
                    <p><b>Fecha: </b>{`${gasto.fecha}`}</p>
                  </div>
                  <Button
                    variant="light"
                    className="delete-gasto-button"
                    onClick={() => handleShowModal(gasto)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))
            ) : (
              <p>Aún no ha introducido ningún gasto</p>
            )}
          </div>
          {gastos.length > 0 && (
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
          ¿Seguro que quieres borrar el gasto de "{gastoToDelete?.descripcion}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteGasto}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Gastos;
