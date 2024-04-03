//CAMBIOS ADAN
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


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
  useEffect(() => {
    const fetchData = async () => {
      try {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(async () => {
          const response = await axios.get('http://localhost:8080/division/saldos');
          const divisionesConSaldos = response.data;
          const data = new google.visualization.DataTable();
          data.addColumn('string', 'División');
          data.addColumn('number', 'Saldo');
          divisionesConSaldos.forEach(division => {
            data.addRow([division.name, division.saldototal]);
          });
          const options = {
            title: 'Saldos por División',
            width: 900,
            height: 420
          };
          const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
          chart.draw(data, options);
        });
      } catch (error) {
        console.error('Error al obtener los saldos de las divisiones:', error);
      }
    };
  
    fetchData();
  }, []);
  



  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#2D7541', marginBottom: '20px', marginRight:'70px' }}>Saldos por Divisiones</h1>
      <div style={{ border: '2px solid #2D7541', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
        <div id="chart_div" style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', marginLeft:'78px' }}></div>
      </div>
      <button onClick={onClick} className="btn btn-success float-right" style={{ marginRight:'70px'}}>Volver</button>
    </div>
  );
};


//ADAN DICE: en este componente se muestra el contenido del boton 2 (la pantalla que se abre)
const ContenidoBoton2 = ({ onClick }) => {
  return (
    <div style={{ textAlign: 'center' }}>
       <h1 style={{ color: '#2D7541', marginBottom: '20px', marginRight:'20px' }}>Saldos por  Trabajador</h1>
      <div style={{ border: '2px solid #2D7541', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
       
        <div id="chart_div" style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', marginLeft:'50px' }}></div>
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
            <BotonConContenido
              contenidoInicial="Gastos por división"
              contenidoHover="Observa el saldo gastado del último mes de cada división"
              onClick={() => handleButtonClick('gastos_division')}
            />
            <BotonConContenido
              contenidoInicial="Gastos por trabajador"
              contenidoHover="Observa el saldo gastado del último mes de cada trabajador"
              onClick={() => handleButtonClick('gastos_trabajador')}
            />
            <BotonConContenido
              contenidoInicial="Reintegros de saldos"
              contenidoHover="Observa cual es el dinero que se le reintegró a cada trabajador"
              onClick={() => handleButtonClick('reintegros')}
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

