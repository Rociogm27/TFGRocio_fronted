import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarPer from "../navbar/navbar.js";
import './nuevoIngreso.css'; // Archivo CSS para estilos personalizados

const URICrearIngreso = 'http://localhost:8000/ingresos';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';

const NuevoIngreso = () => {
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

      // Crear nuevo ingreso
      const nuevoIngreso = {
        cuenta_id: idCuenta,
        fecha: fecha,
        cantidad: cantidad,
        descripcion: descripcion
      };

      console.log(nuevoIngreso);

      await axios.post(URICrearIngreso, nuevoIngreso);
      setSuccess('Ingreso creado con éxito.');
      setError(null);
      setDescripcion('');
      setCantidad('');
      setFecha('');
      navigate(`/${idUser}`);
    } catch (error) {
      console.error('Error creating ingreso:', error);
      setError('Hubo un error al crear el ingreso.');
      setSuccess(null);
    }
  };

  return (
    <div className="nuevoIngreso-container">
      <NavbarPer idUser={idUser} />
      <div className="nuevoIngreso-box">
        <h1>Crear Nuevo Ingreso</h1>
        <form className="nuevoIngreso-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="nuevoIngreso-button">Crear Ingreso</button>
        </form>
      </div>
    </div>
  );
};

export default NuevoIngreso;
