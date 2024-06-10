import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './ingresos.css';

const URIingresosCuenta = 'http://localhost:8000/ingresos/cuenta/';

const Ingresos = (props) => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchIngresos();
  }, [props.selectedCuentaId]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="ingresos">
      <h2>Ingresos</h2>
      {loading ? (
        <p>Cargando ingresos...</p>
      ) : (
        <div className="ingresos-content">
          <div className="ingresos-list">
            {ingresos.map((ingreso, index) => (
              <div key={index} className="ingreso">
                <p>{`Descripción: ${ingreso.descripcion}`}</p>
                <p>{`Cantidad: ${ingreso.cantidad}`}</p>
              </div>
            ))}
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