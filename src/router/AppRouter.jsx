import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Admin/Dashboard';
import ConsultaDivisiones from '../components/Divisiones/ConsultaDivisiones';
import ConsultaTrabajadores from '../components/Trabajadores/ConsultaTrabajadores';
import Login from '../components/Auth/Login';
import ConsultaAdministradores from '../components/Admin/ConsultaAdministradores';
import RecuperarContra from '../components/Auth/RecuperarContra';
import InfoAdmin from '../components/Admin/InfoAdmin';
import ReporteCharts from '../components/Charts/ReporteCharts';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? element : <Navigate to="/" />;
};

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<RecuperarContra />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
          <Route path="divisiones" element={<PrivateRoute element={<ConsultaDivisiones />} />} />
          <Route path="trabajadores" element={<PrivateRoute element={<ConsultaTrabajadores />} />} />
          <Route path="administradores" element={<PrivateRoute element={<ConsultaAdministradores />} />} />
          <Route path="infoadmin" element={<PrivateRoute element={<InfoAdmin />} />} />
          <Route path="reporte" element={<PrivateRoute element={<ReporteCharts />} />} />
          
          {/* Añade otras rutas hijas según necesites */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;
