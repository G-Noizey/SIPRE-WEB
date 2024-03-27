import React, { useEffect } from 'react';

const ReporteCharts = () => {
  useEffect(() => {

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawCharts);

    function drawCharts() {

      // Gráfico de pastel
      const dataPie = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7]
      ]);

      const optionsPie = {
        title: 'Saldos totales',
        pieHole: 0.4,
      };

      const chartPie = new google.visualization.PieChart(document.getElementById('chart_div_pie'));
      chartPie.draw(dataPie, optionsPie);



      


      // Gráfico de barras
      const dataBar = google.visualization.arrayToDataTable([
        ['Nombre', 'Cantidad'],
        ['Producto A', 100],
        ['Producto B', 200],
        ['Producto C', 150],
        ['Producto D', 300]
      ]);

      const optionsBar = {
        title: 'Gastos del último mes',
        hAxis: {
          title: 'Producto'
        },
        vAxis: {
          title: 'Cantidad'
        }
      };

      const chartBar = new google.visualization.ColumnChart(document.getElementById('chart_div_bar'));
      chartBar.draw(dataBar, optionsBar);


      // Gráfico de barras 2
      const dataBar2 = google.visualization.arrayToDataTable([
        ['Nombre', 'Cantidad'],
        ['Producto A', 100],
        ['Producto B', 200],
        ['Producto C', 150],
        ['Producto D', 300]
      ]);

      const optionsBar2 = {
        title: 'Reintegros de saldo',
        hAxis: {
          title: 'Producto'
        },
        vAxis: {
          title: 'Cantidad'
        }
      };

      const chartBar2 = new google.visualization.ColumnChart(document.getElementById('chart_div_bar2'));
      chartBar2.draw(dataBar2, optionsBar2);

      


    }
  }, []);

  return (
    <div>
      <div id="chart_div_pie" style={{ width: '50%', height: '400px', float: 'left' }}></div>
      <div id="chart_div_bar" style={{ width: '50%', height: '400px', float: 'left' }}></div>
      <div id="chart_div_bar2" style={{ width: '50%', height: '400px', float: 'left' }}></div>

    </div>
  );
};

export default ReporteCharts;
