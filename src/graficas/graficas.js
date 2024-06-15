import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import NavbarPer from "../navbar/navbar.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'c3/c3.css';
import * as d3 from 'd3';
import c3 from 'c3';
import './graficas.css'; // Importar el CSS personalizado

const URICuentasUser = 'http://localhost:8000/cuentas/user/';
const URIGastosCuenta = 'http://localhost:8000/gastos/cuenta/';
const URIIngresosCuenta = 'http://localhost:8000/ingresos/cuenta/';

const Graficos = () => {
    const { idUser } = useParams();
    const [cuentas, setCuentas] = useState([]);
    const [selectedCuentaId, setSelectedCuentaId] = useState(null);
    const [selectedCuentaNombre, setSelectedCuentaNombre] = useState('');
    const [filtro, setFiltro] = useState('dia'); // Filtro puesto por defecto
    const [gastos, setGastos] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCuentas = async () => {
            try {
                const response = await axios.get(`${URICuentasUser}${idUser}`);
                const cuentasData = response.data;
                setCuentas(cuentasData);
                if (cuentasData.length > 0) {
                    const primeraCuenta = cuentasData[0];
                    setSelectedCuentaId(primeraCuenta.id);
                    setSelectedCuentaNombre(primeraCuenta.nombre);
                }
            } catch (error) {
                console.error('Error fetching cuentas:', error);
            }
        };
        fetchCuentas();
    }, [idUser]);

    useEffect(() => {
        if (selectedCuentaId) {
            fetchGastosEIngresos(selectedCuentaId, filtro);
        }
    }, [selectedCuentaId, filtro]);

    const fetchGastosEIngresos = async (cuentaId, filtro) => {
        try {
            const gastosResponse = await axios.get(`${URIGastosCuenta}${cuentaId}`);
            const ingresosResponse = await axios.get(`${URIIngresosCuenta}${cuentaId}`);
            const filteredGastos = filterByDate(gastosResponse.data, filtro);
            const filteredIngresos = filterByDate(ingresosResponse.data, filtro);
            setGastos(filteredGastos);
            setIngresos(filteredIngresos);
            const combinedData = combineData(filteredGastos, filteredIngresos);
            setData(combinedData);
            generateChart(combinedData);
            generatePieChart(filteredGastos, 'gastos');
            generatePieChart(filteredIngresos, 'ingresos');
        } catch (error) {
            console.error('Error fetching gastos o ingresos:', error);
        }
    };

    const filterByDate = (items, filter) => {
        const now = new Date();
        return items.filter(item => {
            const itemDate = new Date(item.fecha);
            switch (filter) {
                case 'dia':
                    return itemDate.toDateString() === now.toDateString();
                case 'semana':
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    return itemDate >= startOfWeek;
                case 'mes':
                    return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                case 'ano':
                    return itemDate.getFullYear() === now.getFullYear();
                default:
                    return false;
            }
        });
    };

    const combineData = (gastos, ingresos) => {
        const combined = [];
        gastos.forEach(gasto => {
            combined.push({
                fecha: gasto.fecha,
                gasto: gasto.cantidad,
                ingreso: 0
            });
        });
        ingresos.forEach(ingreso => {
            const existing = combined.find(item => item.fecha === ingreso.fecha);
            if (existing) {
                existing.ingreso = ingreso.cantidad;
            } else {
                combined.push({
                    fecha: ingreso.fecha,
                    gasto: 0,
                    ingreso: ingreso.cantidad
                });
            }
        });
        return combined.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    };

    const handleCuentaChange = (cuentaId, cuentaNombre) => {
        setSelectedCuentaId(cuentaId);
        setSelectedCuentaNombre(cuentaNombre);
    };

    const handleFiltroChange = (filtro) => {
        setFiltro(filtro);
    };

    const generateChart = (combinedData) => {
        const chartData = {
            x: 'x',
            columns: [
                ['x', ...combinedData.map(item => item.fecha)],
                ['Gastos', ...combinedData.map(item => item.gasto)],
                ['Ingresos', ...combinedData.map(item => item.ingreso)]
            ],
            types: {
                Gastos: 'bar',
                Ingresos: 'bar'
            },
            colors: {
                Gastos: '#FFBB28',
                Ingresos: '#4CAF50'
            }
        };

        c3.generate({
            bindto: '#barChart',
            data: chartData,
            axis: {
                x: {
                    type: 'category'
                }
            }
        });
    };

    const generatePieChart = (data, type) => {
        const chartData = {
            columns: [],
            type: 'pie',
            colors: {
                Gastos: '#FFBB28',
                Ingresos: '#4CAF50'
            }
        };

        if (type === 'gastos') {
            chartData.columns = data.map(gasto => [gasto.descripcion, gasto.cantidad]);
        } else {
            chartData.columns = data.map(ingreso => [ingreso.descripcion, ingreso.cantidad]);
        }

        c3.generate({
            bindto: type === 'gastos' ? '#gastosChart' : '#ingresosChart',
            data: chartData
        });
    };

    return (
        <div>
            <NavbarPer idUser={idUser} />
            <Container fluid className="pagina-graficos mt-5">
                <Container className="contenido-graficos p-4 shadow-lg">
                    <Row className="align-items-center cuenta-select">
                        <Col xs={12} md={4} className="d-flex justify-content-start align-items-center">
                            <DropdownButton
                                id="dropdown-basic-button"
                                title={selectedCuentaId ? `Cambiar cuenta` : "Seleccionar cuenta"}
                                variant="success"
                                className="custom-dropdown"
                            >
                                {cuentas.map((cuenta) => (
                                    <Dropdown.Item
                                        key={cuenta.id}
                                        onClick={() => handleCuentaChange(cuenta.id, cuenta.nombre)}
                                    >
                                        {cuenta.nombre}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>

                        <Col xs={12} md={4} className="text-center">
                            <h4>Cuenta: {selectedCuentaNombre}</h4>
                        </Col>

                        <Col xs={6} md={4} className="text-center">
                            <DropdownButton
                                id="dropdown-filtro-button"
                                title={`Filtro: ${filtro}`}
                                variant="success"
                                className="custom-dropdown"
                            >
                                <Dropdown.Item onClick={() => handleFiltroChange('dia')}>Día</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFiltroChange('semana')}>Semana</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFiltroChange('mes')}>Mes</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFiltroChange('ano')}>Año</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    {cuentas.length === 0 ? (
                        <Row className="justify-content-center mt-5">
                            <Col md={12} className="text-center">
                                <h2>No existe ninguna cuenta aún</h2>
                            </Col>
                        </Row>
                    ) : (
                        <Row className="justify-content-center mt-5">
                            <Col xs={12} md={4}>
                                <h5 className="text-center">Gastos</h5>
                                <div id="gastosChart" className="chart-container"></div>
                            </Col>
                            <Col xs={12} md={4}>
                                <div id="barChart" className="chart-container"></div>
                            </Col>
                            <Col xs={12} md={4}>
                                <h5 className="text-center">Ingresos</h5>
                                <div id="ingresosChart" className="chart-container"></div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </Container>
        </div>
    );
};

export default Graficos;
