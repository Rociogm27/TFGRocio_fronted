import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar los estilos de Bootstrap
//import logo from './path/to/logo'; // Ajusta esta ruta a la ubicación de tu logo
//import fotoUsuario from './path/to/fotoUsuario'; // Ajusta esta ruta a la ubicación de la foto del usuario

function NavbarPersonalizado(props) {
    return (
      <Navbar expand="lg" style={{ background: '#a4d4ae' }} fixed="top">
        <Navbar.Brand className='ms-3'>
          {/* Puedes poner texto o dejarlo vacío si no quieres ningún contenido aquí */}
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
            <span className="navbar-text me-3">{props.email}</span>
            <Nav.Link href={`/${props.idUser}/perfil`} className='navbar-link'>Mi Perfil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  
  export default NavbarPersonalizado;