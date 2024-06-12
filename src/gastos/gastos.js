import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './gastos.css';

const URIgastosCuenta = 'http://localhost:8000/gastos/cuenta/';
const URICuentaDetalle = 'http://localhost:8000/cuentas/';

const Gastos = (props) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null); // New state for user ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await axios.get(`${URIgastosCuenta}${props.selectedCuentaId}`);
        setGastos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gastos:', error);
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

    fetchGastos();
    fetchCuentaDetalle();
  }, [props.selectedCuentaId]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const handleAddGasto = () => {
    if (usuarioId) {
      navigate(`/${usuarioId}/nuevoGasto/${props.selectedCuentaId}`);
    }
  };

  return (
    <div className="gastos">
      <div className="header">
        <h2>Gastos</h2>
        <Button variant="success" className="add-gasto-button" onClick={handleAddGasto}>+</Button>
      </div>
      {loading ? (
        <p>Cargando gastos...</p>
      ) : (
        <div className="gastos-content">
          <div className="gastos-list">
            {gastos.length > 0 ? (
              gastos.map((gasto, index) => (
                <div key={index} className="gasto">
                  <p>{`Descripción: ${gasto.descripcion}`}</p>
                  <p>{`Cantidad: ${gasto.cantidad}`}</p>
                </div>
              ))
            ) : (
              <p>Aún no ha introducido ningún gasto</p>
            )}
          </div>
          {gastos.length > 0 && (
            <div className="grafica">
              <PieChart width={400} height={400}>
                <Pie
                  data={gastos}
                  dataKey="cantidad"
                  cx={200}
                  cy={200}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {gastos.map((entry, index) => (
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

export default Gastos;
