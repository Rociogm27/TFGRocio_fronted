import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registro.css'; // Archivo CSS para estilos personalizados

const URIuser = 'http://localhost:8000/usuarios';

const CompRegistro = () => {
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [nombreUs, setNombreUs] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  async function registro(e) {
    e.preventDefault();
    try {
        const res = await axios.get(URIuser);
        let users = res.data;
        const existeNombre = users.find(usuario => nombreUs === usuario.nombreUser);
        const existeCorreo = users.find(usuario => correo === usuario.email);
        if (existeNombre === undefined && existeCorreo === undefined) {
          console.log(nombreUs)
          console.log(nombre)
          console.log(correo)
          console.log(password)
            await axios.post(URIuser, {
                nombreUser: nombreUs,
                nombre: nombre,
                email: correo,
                contrasena: password
            });
            setSuccess('Usuario creado exitosamente');
            setError(null);
            navigate(`/`); 
        } else if (existeCorreo !== undefined) {
            setError('Correo electrónico ya registrado');
            setSuccess(null);
        } else {
            setError('Nombre de usuario ya registrado');
            setSuccess(null);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        setError('Error al crear el usuario');
        setSuccess(null);
    }
}

  return (
    <div className="registro-container">
      <div className="registro-box">
        <h1>Registro</h1>
        <form className="registro-form" onSubmit={registro}>
          <div className="form-group">
            <label htmlFor="correo">Email:</label>
            <input
              name="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              type="email"
              className="form-control"
              required
              aria-label="Ingrese su email"
              title="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre y apellidos:</label>
            <input
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              type="text"
              className="form-control"
              required
              aria-label="Ingrese su nombre y apellidos"
              title="Nombre y apellidos"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nombreUs">Nombre de usuario:</label>
            <input
              name="nombreUser"
              value={nombreUs}
              onChange={(e) => setNombreUs(e.target.value)}
              type="text"
              className="form-control"
              required
              aria-label="Ingrese su nombre de usuario"
              title="Nombre de usuario"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              name="contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              required
              aria-label="Ingrese su contraseña"
              title="Contraseña"
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
          <button type="submit" className="registro-button">Crear cuenta</button>
        </form>
        <p className="login-link">
          ¿Ya tiene una cuenta? <a href="/">Inicie sesión</a>
        </p>
      </div>
    </div>
  );
};

export default CompRegistro;
