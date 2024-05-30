import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './login.css'; // Archivo CSS para estilos personalizados

const URIuser = 'http://localhost:8000/usuarios';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function inicioSesion(e) {
    e.preventDefault();

    axios.get(URIuser)
      .then(response => {
        const usuarios = response.data;
        const usuarioEncontrado = usuarios.find(usuario => usuario.email === user && usuario.contrasena === password);
        if (usuarioEncontrado !== undefined) {
          navigate(`/${usuarioEncontrado.id}`);
        } else {
          setError('Email o contraseña incorrecta.');
        }
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bienvenido a su gestor económico</h1>
        <form className="login-form" onSubmit={inicioSesion}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              type="email"
              className="form-control"
              required
              aria-label="Ingrese su email"
              title="Email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
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
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
        <p className="register-link">
          ¿No tiene una cuenta? <Link to="/registro">Regístrese aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;