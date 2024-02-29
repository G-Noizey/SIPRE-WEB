import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login'; // Tu componente de login
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Admin/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> // Añade esta ruta
      </Routes>
    </BrowserRouter>
  );
}

export default App;
