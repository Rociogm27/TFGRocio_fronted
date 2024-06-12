import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ingresos.css';

const URIingresosCuenta = 'http://localhost:8000/ingresos/cuenta/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';

const Ingresos = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null); // New state for user ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const response = await axios.get(`${URIingresosCuenta}${props.selectedCuentaId}`);
        setIngresos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ingresos:', error);
        setLoading(false);
      }
    };

    const fetchCuentaDetalle = async () => {
      try {
        const response = await axios.get(`${URICuentaDetalle}${props.selectedCuentaId}`);
        setUsuarioId(response.data.usuario_id); // Set user ID from account details
      } catch (error) {
        console.error('Error fetching cuenta details:', error);
      }
    };

    fetchIngresos();
    fetchCuentaDetalle();
  }, [props.selectedCuentaId]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const handleAddIngreso = () => {
    if (usuarioId) {
      navigate(`/${usuarioId}/nuevoIngreso/${props.selectedCuentaId}`);
    }
  };

  return (
    <div className="ingresos">
      <div className="header">
        <h2>Ingresos</h2>
        <Button variant="success" className="add-ingreso-button" onClick={handleAddIngreso}>+</Button>
      </div>
      {loading ? (
        <p>Cargando ingresos...</p>
      ) : (
        <div className="ingresos-content">
          <div className="ingresos-list">
            {ingresos.length > 0 ? (
              ingresos.map((ingreso, index) => (
                <div key={index} className="ingreso">
                  <p>{`Descripción: ${ingreso.descripcion}`}</p>
                  <p>{`Cantidad: ${ingreso.cantidad}`}</p>
                </div>
              ))
            ) : (
              <p>Aún no ha introducido ningún ingreso</p>
            )}
          </div>
          {ingresos.length > 0 && (
            <div className="grafica">
              <PieChart width={400} height={400}>
                <Pie
                  data={ingresos}
                  dataKey="cantidad"
                  cx={200}
                  cy={200}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {ingresos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ingresos;
