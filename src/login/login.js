import React from 'react';
import { Link } from 'react-router-dom';
import './login.css'; // Asegúrate de crear un archivo CSS para estilos personalizados

const Login = () => {
  return (
    <div className="login-container">
      <h1>Bienvenido a su gestor económico</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>
        ¿No tiene una cuenta? <Link to="/register">Regístrese aquí</Link>
      </p>
    </div>
  );
};

export default Login;