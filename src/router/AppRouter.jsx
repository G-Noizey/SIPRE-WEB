import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Admin/Dashboard';
import ConsultaDivisiones from '../components/Divisiones/ConsultaDivisiones';
import ConsultaTrabajadores from '../components/Trabajadores/ConsultaTrabajadores';
import Login from '../components/Auth/Login';

function AppRouter() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login/>      } />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/divisiones" element={<ConsultaDivisiones />} />
          <Route path="/dashboard/trabajadores" element={<ConsultaTrabajadores />} />
          {/* Añade otras rutas hijas según necesites */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter  