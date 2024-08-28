import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './administrador.css'; // Archivo CSS para estilos personalizados

const URIuser = 'http://localhost:8000/usuarios';
const URIupdateUser = 'http://localhost:8000/usuarios/';

const Administradores = () => {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Obtener la lista de usuarios y el email del administrador actual
    const fetchUsuarios = async () => {
      
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(URIuser, {
          headers: {
            'auth-token': token // Pasar el token en la cabecera
          }
        });
        const adminUser = response.data.find(user => user.id === parseInt(idUser));
        setAdminEmail(adminUser.email);
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    fetchUsuarios();
  }, [idUser]);

  const handleAdminChange = async (id, isAdmin) => {
    const token = localStorage.getItem('token');

    try {
      const updatedUser = {
        admin: isAdmin ? 1 : 0
      };
      await axios.put(`${URIupdateUser}${id}`, updatedUser, {
        headers: {
          'auth-token': token // Pasar el token en la cabecera
        }
      });
      setUsuarios(usuarios.map(user => user.id === id ? { ...user, admin: isAdmin ? 1 : 0 } : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // Elimina el token del almacenamiento local+
    localStorage.removeItem('idUser');  // Elimina el user del almacenamiento local

    navigate('/');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Pantalla de Administrador</h1>
          <p>{adminEmail}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </header>
      <div className="usuarios-list">
        {usuarios.map(usuario => (
          <div key={usuario.id} className="usuario-card">
            <h2>{usuario.nombreUser}</h2>
            <p>Nombre: {usuario.nombre}</p>
            <p>Email: {usuario.email}</p>
            <label>
              Administrador:
              <input
                type="checkbox"
                checked={usuario.admin === 1}
                onChange={(e) => handleAdminChange(usuario.id, e.target.checked)}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Administradores;
