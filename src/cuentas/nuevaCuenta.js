import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarPer from "../navbar/navbar.js";
import './nuevaCuenta.css'; // Archivo CSS para estilos personalizados

const URICuentasUser = 'http://localhost:8000/cuentas/user/';
const URICrearCuenta = 'http://localhost:8000/cuentas';

const NuevaCuenta = () => {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [saldo, setSaldo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Función para obtener el token desde localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar si el saldo es un número positivo
      if (isNaN(saldo) || saldo <= 0) {
        setError('El saldo debe ser un número positivo.');
        setSuccess(null);
        return;
      }

      const token = getAuthToken(); // Recuperar el token

      // Verificar si el usuario ya tiene una cuenta con el mismo nombre
      const response = await axios.get(`${URICuentasUser}${idUser}`, {
        headers: {
          'auth-token': token // Pasar el token en la cabecera
        }
      });
      const cuentas = response.data;
      const cuentaExistente = cuentas.find((cuenta) => cuenta.nombre === nombre);

      if (cuentaExistente) {
        setError('Ya existe una cuenta con ese nombre.');
        setSuccess(null);
        return;
      }

      // Crear nueva cuenta
      const nuevaCuenta = {
        usuario_id: idUser,
        nombre: nombre,
        saldo_inicial: saldo,
        saldo_actual: saldo
      };

      await axios.post(URICrearCuenta, nuevaCuenta, {
        headers: {
          'auth-token': token // Pasar el token en la cabecera
        }
      });
      
      setSuccess('Cuenta creada con éxito.');
      setError(null);
      setNombre('');
      setSaldo('');
      navigate(`/${idUser}/cuentas`);
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Hubo un error al crear la cuenta.');
      setSuccess(null);
    }
  };

  return (
    <div className="nuevaCuenta-container">
      <NavbarPer idUser={idUser} />
      <div className="nuevaCuenta-box">
        <h1>Crear Nueva Cuenta</h1>
        
        <div className="linea"></div>

        <form className="nuevaCuenta-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Cuenta</label>
            <input
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="saldo">Saldo Inicial</label>
            <input
              name="saldo"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              type="number"
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
          <button type="submit" className="nuevaCuenta-button">Crear Cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default NuevaCuenta;
