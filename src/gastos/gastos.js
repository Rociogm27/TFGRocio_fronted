import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './gastos.css';

const URIgastosCuenta = 'http://localhost:8000/gastos/cuenta/';

const Gastos = (props) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchGastos();
  }, [props.selectedCuentaId]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="gastos">
      <h2>Gastos</h2>
      {loading ? (
        <p>Cargando gastos...</p>
      ) : (  
        <div className="gastos-content">
          <div className="gastos-list">
            {gastos.map((gasto, index) => (
              <div key={index} className="gasto">
                <p>{`Descripción: ${gasto.descripcion}`}</p>
                <p>{`Cantidad: ${gasto.cantidad}`}</p>
              </div>
            ))}
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