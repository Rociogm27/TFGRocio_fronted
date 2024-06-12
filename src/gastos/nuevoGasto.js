import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarPer from "../navbar/navbar.js";
import './nuevoGasto.css'; // Archivo CSS para estilos personalizados

const URICrearGasto = 'http://localhost:8000/gastos';

const NuevoGasto = () => {
  const { idUser, idCuenta } = useParams();
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar si la cantidad es un número positivo
      if (isNaN(cantidad) || cantidad <= 0) {
        setError('La cantidad debe ser un número positivo.');
        setSuccess(null);
        return;
      }

      // Crear nuevo gasto
      const nuevoGasto = {
        cuenta_id: idCuenta,
        fecha: fecha,
        cantidad: cantidad,
        descripcion: descripcion
      };

      console.log(nuevoGasto);

      await axios.post(URICrearGasto, nuevoGasto);
      setSuccess('Gasto creado con éxito.');
      setError(null);
      setDescripcion('');
      setCantidad('');
      setFecha('');
      navigate(`/${idUser}`);
    } catch (error) {
      console.error('Error creating gasto:', error);
      setError('Hubo un error al crear el gasto.');
      setSuccess(null);
    }
  };

  return (
    <div className="nuevoGasto-container">
      <NavbarPer idUser={idUser} />
      <div className="nuevoGasto-box">
        <h1>Crear Nuevo Gasto</h1>
        <form className="nuevoGasto-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <input
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              type="text"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              name="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              type="number"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <input
              name="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              type="date"
              className="form-control"
              required
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}
          <button type="submit" className="nuevoGasto-button">Crear Gasto</button>
        </form>
      </div>
    </div>
  );
};

export default NuevoGasto;