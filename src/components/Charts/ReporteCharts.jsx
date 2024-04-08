import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';



//RUTA DE LA API
const apiUrl = import.meta.env.VITE_API_URL;


const BotonConContenido = ({ contenidoInicial, contenidoHover, contenidoBoton, onClick }) => {
  const [hover, setHover] = useState(false);

  const cambiarColorYTexto = () => {
    setHover(!hover);
  };

  return (
    <div className="text-center">
      <button
        className="btn btn-success"
        onClick={onClick}
        onMouseEnter={cambiarColorYTexto}
        onMouseLeave={cambiarColorYTexto}
        style={{
          marginBottom: '20px',
          color: hover ? 'green' : '',
          borderColor: hover ? 'green' : '',
          backgroundColor: hover ? 'white' : '',
          width: '100%',
          height: '60px',
          transition: 'all 0.3s ease' // Transición suave durante 0.3 segundos
        }}
      >
        {hover ? contenidoHover : contenidoInicial}
      </button>
      {contenidoBoton}
    </div>
  );
};

//ADAN DICE: en este componente se muestra el contenido del boton 1 (la pantalla que se abre)
const ContenidoBoton1 = ({ onClick }) => {
  const [divisionesConSaldosTotal, setDivisionesConSaldosTotal] = useState([]);
  const [divisionesConSaldosActuales, setDivisionesConSaldosActuales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTotal = await axios.get(`${apiUrl}/division/saldos`);
        setDivisionesConSaldosTotal(responseTotal.data);

        const responseActual = await axios.get(`${apiUrl}/division/saldos`);
        setDivisionesConSaldosActuales(responseActual.data);
      } catch (error) {
        console.error('Error al obtener los saldos de las divisiones:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (divisionesConSaldosTotal.length > 0 && divisionesConSaldosActuales.length > 0) {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => drawCharts());
    }
  }, [divisionesConSaldosTotal, divisionesConSaldosActuales]);

  const drawCharts = () => {
    const dataTotal = new google.visualization.DataTable();
    dataTotal.addColumn('string', 'División');
    dataTotal.addColumn('number', 'Saldo Total');
    divisionesConSaldosTotal.forEach(division => {
      dataTotal.addRow([division.name, division.saldototal]);
    });

    const dataActual = new google.visualization.DataTable();
    dataActual.addColumn('string', 'División');
    dataActual.addColumn('number', 'Saldo Actual');
    divisionesConSaldosActuales.forEach(division => {
      dataActual.addRow([division.name, division.saldo]);
    });

    const options = {
      title: 'Comparativa de Saldos',
      width: 510,
      height: 420
    };

    const chartTotal = new google.visualization.PieChart(document.getElementById('chart_div_total'));
    chartTotal.draw(dataTotal, options);

    const chartActual = new google.visualization.PieChart(document.getElementById('chart_div_actual'));
    chartActual.draw(dataActual, options);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#2D7541', marginBottom: '20px', marginRight: '70px' }}>Comparativa de Saldos</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ border: '2px solid #2D7541', borderRadius: '10px', padding: '20px', marginBottom: '20px', width: '45%' }}>
          <h2 style={{ color: '#2D7541', marginBottom: '20px' }}>Saldos Totales por División</h2>
          <div id="chart_div_total" style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center' }}></div>
        </div>
        <div style={{ border: '2px solid #2D7541', borderRadius: '10px', padding: '20px', marginBottom: '20px', width: '45%' }}>
          <h2 style={{ color: '#2D7541', marginBottom: '20px' }}>Saldos Actuales por División</h2>
          <div id="chart_div_actual" style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center' }}></div>
        </div>
      </div>
      <button onClick={onClick} className="btn btn-success float-right" style={{ marginRight: '70px' }}>Volver</button>
    </div>
  );
};

//ADAN DICE: en este componente se muestra el contenido del boton 2 (la pantalla que se abre)
const ContenidoBoton2 = ({ onClick }) => {
  const [divisiones, setDivisiones] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [saldosTrabajadores, setSaldosTrabajadores] = useState([]);
  const [saldosTotales, setSaldosTotales] = useState([]);

  useEffect(() => {
    const fetchDivisiones = async () => {
      try {
        const response = await axios.get(`${apiUrl}/division/`);
        setDivisiones(response.data.body);
      } catch (error) {
        console.error('Error al obtener las divisiones:', error);
      }
    };

    fetchDivisiones();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDivision) {
          const responseTotal = await axios.get(`${apiUrl}/worker/saldosPorDivision/${selectedDivision}`);
          setSaldosTotales(responseTotal.data);

          const responseActual = await axios.get(`${apiUrl}/worker/saldosPorDivision/${selectedDivision}`);
          setSaldosTrabajadores(responseActual.data);
        }
      } catch (error) {
        console.error('Error al obtener los saldos de los trabajadores por división:', error);
      }
    };

    fetchData();
  }, [selectedDivision]);

  const handleDivisionChange = async (event) => {
    const selectedDivisionId = event.target.value;
    setSelectedDivision(selectedDivisionId);
  };

  const drawCharts = () => {
    const dataTotal = new google.visualization.DataTable();
    dataTotal.addColumn('string', 'Trabajador');
    dataTotal.addColumn('number', 'Saldo Total');
    saldosTotales.forEach((trabajador, index) => {
      dataTotal.addRow([`${trabajador.name}`, trabajador.saldototal]);
    });

    const options = {
      title: 'Saldos Totales por Trabajador',
      width: 550,
      height: 420
    };
    const chartTotal = new google.visualization.PieChart(document.getElementById('chart_div_total'));
    chartTotal.draw(dataTotal, options);

    const dataActual = new google.visualization.DataTable();
    dataActual.addColumn('string', 'Trabajador');
    dataActual.addColumn('number', 'Saldo Actual');
    saldosTrabajadores.forEach((trabajador, index) => {
      dataActual.addRow([`${trabajador.name}`, trabajador.saldo]);
    });

    const optionsActual = {
      title: 'Saldos Actuales por Trabajador',
      width: 550,
      height: 420
    };
    const chartActual = new google.visualization.PieChart(document.getElementById('chart_div_actual'));
    chartActual.draw(dataActual, optionsActual);
  };

  useEffect(() => {
    if (saldosTotales.length > 0 && saldosTrabajadores.length > 0) {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => drawCharts());
    }
  }, [saldosTotales, saldosTrabajadores]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#2D7541', marginBottom: '20px', marginRight: '20px' }}>Saldos por Trabajador</h1>
      <div style={{ border: '2px solid #2D7541', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
        {/* Selector de divisiones */}
        <select
          value={selectedDivision}
          onChange={handleDivisionChange}
          style={{
            marginBottom: '20px',
            border: 'none', // Eliminar el contorno
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', // Agregar una sombra
            backgroundColor: 'white', // Añadir un fondo blanco para que la sombra sea visible
            padding: '8px', // Añadir un poco de relleno para separar el texto del borde
            borderRadius: '8px' // Agregar bordes redondeados
          }}
        >
          <option value="">Selecciona una división</option>
          {divisiones.map((division) => (
            <option key={division.id} value={division.id}>{division.name}</option>
          ))}
        </select>

        {/* Mostrar la gráfica de los saldos totales de los trabajadores de la división seleccionada */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div id="chart_div_total" style={{ width: '45%', height: '400px', marginRight: '10px' }}></div>
          <div id="chart_div_actual" style={{ width: '45%', height: '400px', marginLeft: '10px' }}></div>
        </div>
      </div>
      <button onClick={onClick} className="btn btn-success float-right">Volver</button>
    </div>
  );
};


const App = () => {
  const [currentPage, setCurrentPage] = useState('main');

  const handleButtonClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-5">
      {currentPage === 'main' && (
        <div className="row justify-content-center">
          <div className="col-md-4">
            <BotonConContenido
              contenidoInicial="Saldos por Divisiones"
              contenidoHover="Observa el saldo total de cada división"
              onClick={() => handleButtonClick('divisiones')}
            />
            <BotonConContenido
              contenidoInicial="Saldos por Trabajador"
              contenidoHover="Observa el saldo total de cada trabajador de acuerdo al saldo de su división"
              onClick={() => handleButtonClick('trabajador')}
            />
          </div>
        </div>
      )}
      {currentPage === 'divisiones' && (
        <ContenidoBoton1 onClick={() => setCurrentPage('main')} />
      )}
      {currentPage === 'trabajador' && (
        <ContenidoBoton2 onClick={() => setCurrentPage('main')} />
      )}
      {/* Agregar otros casos para las páginas restantes */}
    </div>
  );
};

export default App;