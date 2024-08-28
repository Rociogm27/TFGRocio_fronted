import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; // Archivo CSS para estilos personalizados
import fotoLogin from './Foto_login.jpg'; // Importar la imagen

const URIuser = 'http://localhost:8000/usuarios';
const URIuserLogin = 'http://localhost:8000/usuarios/login';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function inicioSesion(e) {
    e.preventDefault();

    try {
      const response = await axios.get(URIuser);
      const usuarios = response.data;
      const usuarioEncontrado = usuarios.find(usuario => usuario.email === user && usuario.contrasena === password);

      if (usuarioEncontrado !== undefined) {
        
        const responsee = await axios.post(URIuserLogin, { id: usuarioEncontrado.id });
        const { token } = responsee.data;

        console.log(token)
        // Almacenar el token en el almacenamiento local
        localStorage.setItem('token', token);
        localStorage.setItem('idUser', usuarioEncontrado.id);

        if (usuarioEncontrado.admin === 1) {
          navigate(`/${usuarioEncontrado.id}/administrador`);
        } else {
          navigate(`/${usuarioEncontrado.id}`);
        }
      } else {
        setError('Email o contraseña incorrecta.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Hubo un error al iniciar sesión.');
    }
  }

  

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={fotoLogin} alt="Dinero y ahorro" />
        <h2>Gestor económico</h2>
        <p>Toma el control de tus finanzas y asegura tu futuro con nuestro gestor económico. Simplifica tu vida financiera, optimiza tus ingresos y gastos, y empieza a ahorrar hoy. Convierte tus sueños en realidad.</p>
      </div>
      <div className="right-section">
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
    </div>
  );
};

export default Login;
