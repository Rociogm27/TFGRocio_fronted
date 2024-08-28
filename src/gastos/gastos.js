import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import c3 from 'c3';
import 'c3/c3.css';
import './gastos.css';

const URIgastosCuenta = 'http://localhost:8000/gastos/cuenta/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';
const URIGasto = 'http://localhost:8000/gastos/';
const URINotificacion = 'http://localhost:8000/notificaciones';

const Gastos = (props) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);
  const [cuentaDetalle, setCuentaDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const [gastoEditando, setGastoEditando] = useState(null);
  const [editValues, setEditValues] = useState({
    categoria: '',
    descripcion: '',
    cantidad: '',
    fecha: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const token = getAuthToken();

        const response = await axios.get(`${URIgastosCuenta}${props.selectedCuentaId}`, {
          headers: {
            'auth-token': token
          }
        });
        setGastos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gastos:', error);
        setLoading(false);
      }
    };

    const fetchCuentaDetalle = async () => {
      try {
        const token = getAuthToken();

        const response = await axios.get(`${URICuentaDetalle}${props.selectedCuentaId}`, {
          headers: {
            'auth-token': token
          }
        });
        setCuentaDetalle(response.data);
        setUsuarioId(response.data.usuario_id);
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

      const token = getAuthToken();

      await axios.delete(`${URIGasto}${gastoToDelete.id}`, {
        headers: {
          'auth-token': token
        }
      });

      const nuevoSaldo = cuentaDetalle.saldo_actual + gastoToDelete.cantidad;
      await axios.put(`${URICuentaDetalle}${props.selectedCuentaId}`, {
        ...cuentaDetalle,
        saldo_actual: nuevoSaldo,
      }, {
        headers: {
          'auth-token': token
        }
      });

      // Crear notificación
      const mensaje = `El gasto: '${gastoToDelete.descripcion}' ha sido borrado de la cuenta: '${cuentaDetalle.nombre}'`;
      const nuevaNotificacion = {
        usuario_id: usuarioId,
        mensaje: mensaje,
        fecha_creacion: new Date().toISOString().split('T')[0]
      };

      await axios.post(URINotificacion, nuevaNotificacion, {
        headers: {
          'auth-token': token
        }
      });

      setGastos(gastos.filter(gasto => gasto.id !== gastoToDelete.id));

      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting gasto:', error);
    }
  };

  const handleEditGasto = (gasto) => {
    setGastoEditando(gasto.id);
    setEditValues({
      categoria: gasto.categoria,
      descripcion: gasto.descripcion,
      cantidad: gasto.cantidad,
      fecha: gasto.fecha,
    });
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value,
    });
  };

  const handleSaveEdit = async (gastoId) => {
    try {
      const token = getAuthToken();

      // Calcular la diferencia entre la cantidad antigua y la nueva
      const gastoOriginal = gastos.find(gasto => gasto.id === gastoId);
      const diferenciaCantidad = editValues.cantidad - gastoOriginal.cantidad;

      // Verificar si el saldo es suficiente para la nueva cantidad
      const nuevoSaldo = cuentaDetalle.saldo_actual + gastoOriginal.cantidad - editValues.cantidad;
      if (nuevoSaldo < 0) {
        setErrorMessage('Saldo insuficiente para realizar esta operación.');
        return;
      }

      // Actualizar el gasto
      await axios.put(`${URIGasto}${gastoId}`, editValues, {
        headers: {
          'auth-token': token
        }
      });

      // Actualizar el saldo de la cuenta
      await axios.put(`${URICuentaDetalle}${props.selectedCuentaId}`, {
        ...cuentaDetalle,
        saldo_actual: nuevoSaldo,
      }, {
        headers: {
          'auth-token': token
        }
      });

      setGastos(gastos.map(gasto => gasto.id === gastoId ? { ...gasto, ...editValues } : gasto));
      setGastoEditando(null);
      setErrorMessage('');
      // Recargar la página para reflejar los cambios
    window.location.reload();
    } catch (error) {
      console.error('Error updating gasto:', error);
    }
  };

  const handleCancelEdit = () => {
    setGastoEditando(null);
    setErrorMessage('');
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

  const today = new Date().toISOString().split("T")[0];

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
                  {gastoEditando === gasto.id ? (
                    <div className='col'>
                    <div className="gasto-edit-form">
                      <select
                        name="categoria"
                        value={editValues.categoria}
                        onChange={handleInputChange}
                      >
                        <option value="">Seleccione una categoría</option>
                        <option value="Salud">Salud</option>
                        <option value="Ocio">Ocio</option>
                        <option value="Casa">Casa</option>
                        <option value="Café">Café</option>
                        <option value="Educación">Educación</option>
                        <option value="Regalos">Regalos</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Familia">Familia</option>
                        <option value="Coche">Coche</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <input
                        type="text"
                        name="descripcion"
                        value={editValues.descripcion}
                        onChange={handleInputChange}
                      />
                      <input
                        type="number"
                        name="cantidad"
                        value={editValues.cantidad}
                        onChange={handleInputChange}
                      />
                      <input
                        type="date"
                        name="fecha"
                        value={editValues.fecha}
                        onChange={handleInputChange}
                        max={today} // Restringe la selección de fechas futuras
                      />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className='col'>
                      <div className="gasto-buttons">
                        <Button className="save-button" onClick={() => handleSaveEdit(gasto.id)}>Guardar</Button>
                        <Button className="cancel-button" onClick={handleCancelEdit}>Cancelar</Button>
                      </div>
                    </div>
                    </div>
                  ) : (
                    <>
                      <div className="gasto-details">
                        <p><b>Categoria: </b>{gasto.categoria}</p>
                        <p><b>Descripción: </b>{gasto.descripcion}</p>
                        <p><b>Cantidad: </b>{gasto.cantidad}</p>
                        <p><b>Fecha: </b>{gasto.fecha}</p>
                      </div>
                      <div className="gasto-actions">
                        <Button
                          variant="light"
                          className="edit-gasto-button"
                          onClick={() => handleEditGasto(gasto)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          className="delete-gasto-button"
                          onClick={() => handleShowModal(gasto)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </>
                  )}
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
