import axios from 'axios';
import { useState, useEffect } from 'react';
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
  const [categoria, setCategoria] = useState('');
  const [esFijo, setEsFijo] = useState(false);
  const [saldoActual, setSaldoActual] = useState(null); // Estado para el saldo actual
  const [nombreCuenta, setNombreCuenta] = useState(''); // Estado para el nombre de la cuenta
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Función para obtener el token desde localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchSaldoActual = async () => {
      try {
        const token = getAuthToken(); // Recuperar el token
        const response = await axios.get(`${URICuentaDetalle}${idCuenta}`, {
          headers: {
            'auth-token': token // Pasar el token en la cabecera
          }
        });
        setSaldoActual(response.data.saldo_actual);
        setNombreCuenta(response.data.nombre); // Guardar el nombre de la cuenta
      } catch (error) {
        console.error('Error fetching saldo:', error);
      }
    };

    fetchSaldoActual();
  }, [idCuenta]);

  const handleSubmit = async (e) => {
    const token = getAuthToken();
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
        descripcion: descripcion,
        categoria: categoria,
        es_fijo: esFijo ? 1 : 0
      };

      console.log(nuevoIngreso);

      await axios.post(URICrearIngreso, nuevoIngreso, {
        headers: {
          'auth-token': token // Pasar el token en la cabecera
        }
      });

      // Obtener detalles de la cuenta
      const responseCuenta = await axios.get(`${URICuentaDetalle}${idCuenta}`, {
        headers: {
          'auth-token': token // Pasar el token en la cabecera
        }
      });
      const cuenta = responseCuenta.data;

      // Actualizar saldo_actual
      const nuevoSaldo = parseFloat(cuenta.saldo_actual) + parseFloat(cantidad);
      const cuentaActualizada = {
        saldo_actual: nuevoSaldo
      };

      console.log(cuentaActualizada);

      await axios.put(`${URICuentaDetalle}${idCuenta}`, cuentaActualizada, {
        headers: {
          'auth-token': token // Pasar el token en la cabecera
        }
      });

      setSuccess('Ingreso creado con éxito.');
      setError(null);
      setDescripcion('');
      setCantidad('');
      setFecha('');
      setCategoria('');
      setEsFijo(false);
      navigate(`/${idUser}`);
    } catch (error) {
      console.error('Error creating ingreso:', error);
      setError('Hubo un error al crear el ingreso.');
      setSuccess(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="nuevoIngreso-container">
      <NavbarPer idUser={idUser} />
      <div className="saldo-actual">
        <h3><b>Cuenta:</b> {nombreCuenta}</h3> {/* Mostrar el nombre de la cuenta */}
        <h3><b>Saldo Actual:</b> {saldoActual}€</h3>
      </div>
      <div className="nuevoIngreso-box">
        <h1><b>Crear Nuevo Ingreso</b></h1>
        <form className="nuevoIngreso-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <input
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              type="text"
              placeholder="Descripción del ingreso"
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
              <option value="Salario">Salario</option>
              <option value="Regalo">Regalo</option>
              <option value="Interés">Interés</option>
              <option value="Inversión">Inversión</option>
              <option value="Subvenciones">Subvenciones</option>
              <option value="Loteria">Loteria</option>
              <option value="Herencia">Herencia</option>
              <option value="Otro">Otro</option>
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
              max={today} // Restringe la selección de fechas futuras
              type="date"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="esFijo">Es ingreso fijo</label>
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
          <button type="submit" className="nuevoIngreso-button">Crear Ingreso</button>
        </form>
      </div>
    </div>
  );
};

export default NuevoIngreso;
