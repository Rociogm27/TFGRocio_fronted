import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css'; // Importar el CSS personalizado

const URIUsuario = 'http://localhost:8000/usuarios/';

function NavbarPersonalizado(props) {
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URIUsuario}${props.idUser}`, {
                    headers: {
                    'auth-token': token
                    }
                  });
                setEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user email:', error);
            }
        };
        fetchEmail();
    }, [props.idUser]);

    return (
        <Navbar className="navbar-personalizado" expand="lg" fixed="top">
            <Navbar.Brand className='ms-3 brand-text'>
                Gestor de gastos
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className='navbar-collapse'>
                <Nav className="me-auto">
                    <Nav.Link href={`/${props.idUser}`} className='navbar-link'>Inicio</Nav.Link>
                    <Nav.Link href={`/${props.idUser}/cuentas`} className='navbar-link'>Cuentas</Nav.Link>
                    <Nav.Link href={`/${props.idUser}/graficos`} className='navbar-link'>Gráficos</Nav.Link>
                    <Nav.Link href={`/${props.idUser}/notificaciones`} className='navbar-link'>Notificaciones</Nav.Link>
                    <Nav.Link href={`/${props.idUser}/sugerencias`} className='navbar-link'>Sugerencias</Nav.Link>
                </Nav>
                <Nav>
                    <span className="navbar-text me-5">{email}</span>
                    <Nav.Link href={`/${props.idUser}/perfil`} className='navbar-perfil me-3'>Mi Perfil</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarPersonalizado;
