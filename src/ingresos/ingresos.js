import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import c3 from 'c3';
import 'c3/c3.css';
import './ingresos.css';

const URIingresosCuenta = 'http://localhost:8000/ingresos/cuenta/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';
const URIIngreso = 'http://localhost:8000/ingresos/';
const URINotificacion = 'http://localhost:8000/notificaciones';

const Ingresos = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);
  const [cuentaDetalle, setCuentaDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ingresoToDelete, setIngresoToDelete] = useState(null);
  const [ingresoEditando, setIngresoEditando] = useState(null);
  const [editValues, setEditValues] = useState({
    categoria: '',
    descripcion: '',
    cantidad: '',
    fecha: '',
  });
  const navigate = useNavigate();

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = getAuthToken();

        const response = await axios.get(`${URIingresosCuenta}${props.selectedCuentaId}`, {
          headers: {
            'auth-token': token
          }
        });
        setIngresos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ingresos:', error);
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

      const token = getAuthToken();

      await axios.delete(`${URIIngreso}${ingresoToDelete.id}`, {
        headers: {
          'auth-token': token
        }
      });

      const nuevoSaldo = cuentaDetalle.saldo_actual - ingresoToDelete.cantidad;
      await axios.put(`${URICuentaDetalle}${props.selectedCuentaId}`, {
        ...cuentaDetalle,
        saldo_actual: nuevoSaldo,
      }, {
        headers: {
          'auth-token': token
        }
      });

      // Crear notificación
      const mensaje = `El ingreso: '${ingresoToDelete.descripcion}' ha sido borrado de la cuenta: '${cuentaDetalle.nombre}'`;
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

      setIngresos(ingresos.filter(ingreso => ingreso.id !== ingresoToDelete.id));

      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting ingreso:', error);
    }
  };

  const handleEditIngreso = (ingreso) => {
    setIngresoEditando(ingreso.id);
    setEditValues({
      categoria: ingreso.categoria,
      descripcion: ingreso.descripcion,
      cantidad: ingreso.cantidad,
      fecha: ingreso.fecha,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value,
    });
  };

  const handleSaveEdit = async (ingresoId) => {
    try {
      const token = getAuthToken();
  
      // Calcular la diferencia entre la cantidad antigua y la nueva
      const ingresoOriginal = ingresos.find(ingreso => ingreso.id === ingresoId);
      const diferenciaCantidad = editValues.cantidad - ingresoOriginal.cantidad;
  
      // Verificar si el saldo será positivo después de la actualización
      const nuevoSaldo = cuentaDetalle.saldo_actual + diferenciaCantidad;
      if (nuevoSaldo < 0) {
        alert('Saldo insuficiente para realizar esta operación.');
        return;
      }
  
      // Actualizar el ingreso
      await axios.put(`${URIIngreso}${ingresoId}`, editValues, {
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
  
      // Actualizar el estado de los ingresos
      setIngresos(ingresos.map(ingreso => ingreso.id === ingresoId ? { ...ingreso, ...editValues } : ingreso));
      setIngresoEditando(null);
  
      // Recargar la página para reflejar los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error updating ingreso:', error);
    }
  };

  const handleCancelEdit = () => {
    setIngresoEditando(null);
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

  const today = new Date().toISOString().split("T")[0];

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
                  {ingresoEditando === ingreso.id ? (
                    <div className='col'>
                      <div className="ingreso-edit-form">
                        <select
                          name="categoria"
                          value={editValues.categoria}
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccione una categoría</option>
                          <option value="Salario">Salario</option>
                          <option value="Regalo">Regalo</option>
                          <option value="Interés">Interés</option>
                          <option value="Inversión">Inversión</option>
                          <option value="Subvenciones">Subvenciones</option>
                          <option value="Loteria">Loteria</option>
                          <option value="Herencia">Herencia</option>
                          <option value="Otro">Otro</option>
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
                      <div className='col'>
                        <div className="ingreso-buttons">
                          <Button className="save-button" onClick={() => handleSaveEdit(ingreso.id)}>Guardar</Button>
                          <Button className="cancel-button" onClick={handleCancelEdit}>Cancelar</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="ingreso-details">
                        <p><b>Categoria: </b>{ingreso.categoria}</p>
                        <p><b>Descripción: </b>{ingreso.descripcion}</p>
                        <p><b>Cantidad: </b>{ingreso.cantidad}</p>
                        <p><b>Fecha: </b>{ingreso.fecha}</p>
                      </div>
                      <div className="ingreso-actions">
                        <Button
                          variant="light"
                          className="edit-ingreso-button"
                          onClick={() => handleEditIngreso(ingreso)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="light"
                          className="delete-ingreso-button"
                          onClick={() => handleShowModal(ingreso)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </>
                  )}
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
