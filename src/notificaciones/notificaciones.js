import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarPer from "../navbar/navbar.js";

const URICuentasUser = 'http://localhost:8000/cuentas/user/';

const Notificiones = () => {
    const { idUser } = useParams();


  return (
<div>
<NavbarPer idUser={idUser} />
</div>
  );
};

export default Notificiones;
