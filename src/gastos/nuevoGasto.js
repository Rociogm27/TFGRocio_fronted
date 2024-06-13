import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarPer from "../navbar/navbar.js";
import './nuevoGasto.css'; // Archivo CSS para estilos personalizados

const URICrearGasto = 'http://localhost:8000/gastos';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';

const NuevoGasto = () => {
  const { idUser, idCuenta } = useParams();
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const [esFijo, setEsFijo] = useState(false);
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

      // Obtener detalles de la cuenta
      const responseCuenta = await axios.get(`${URICuentaDetalle}${idCuenta}`);
      const cuenta = responseCuenta.data;

      // Verificar si el saldo es suficiente
      if (parseFloat(cuenta.saldo_actual) < parseFloat(cantidad)) {
        setError('Saldo no suficiente en la cuenta.');
        setSuccess(null);
        return;
      }

      // Crear nuevo gasto
      const nuevoGasto = {
        cuenta_id: idCuenta,
        fecha: fecha,
        cantidad: cantidad,
        descripcion: descripcion,
        categoria: categoria,
        es_fijo: esFijo ? 1 : 0
      };

      console.log(nuevoGasto);

      await axios.post(URICrearGasto, nuevoGasto);

      // Actualizar saldo_actual
      const nuevoSaldo = parseFloat(cuenta.saldo_actual) - parseFloat(cantidad);
      const cuentaActualizada = {
        ...cuenta,
        saldo_actual: nuevoSaldo
      };

      await axios.put(`${URICuentaDetalle}${idCuenta}`, cuentaActualizada);

      setSuccess('Gasto creado con éxito.');
      setError(null);
      setDescripcion('');
      setCantidad('');
      setFecha('');
      setCategoria('');
      setEsFijo(false);
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
              placeholder="Descripción del gasto"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <select
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="form-control"
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
              <option value="Otros">Otros</option>
            </select>
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
          <div className="form-group">
            <label htmlFor="esFijo">Es gasto fijo</label>
            <input
              name="esFijo"
              checked={esFijo}
              onChange={(e) => setEsFijo(e.target.checked)}
              type="checkbox"
              className="form-check-input"
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
