import { useState } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { useEffect } from "react";
function InfoAdmin() {
  const [adminData, setAdminData] = useState({
    nombre: '',
    apellido: '',
    userAdmin: '',
    email: ''
  });

  useEffect(() => {
    // Obtener la información del administrador del almacenamiento local al cargar el componente
    const storedName = localStorage.getItem('name');
    const storedApellido = localStorage.getItem('apellido');
    const storedUserAdmin = localStorage.getItem('userAdmin');
    const storedCorreo = localStorage.getItem('email');
  
    // Actualizar el estado con la información del administrador
    setAdminData({
      nombre: storedName || '',
      apellido: storedApellido || '',
      userAdmin: storedUserAdmin || '',
      correo: storedCorreo || '',
    });
  }, []);
  

  return (
    <div className="container-fluid p-3 my-3">
      <div className="row">
        <Form>
          <fieldset>
            <legend>Información de Administrador</legend>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input type="text" className="form-control" id="nombre" value={adminData.nombre} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellidos:</label>
              <input type="text" className="form-control" id="apellido" value={adminData.apellido} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario:</label>
              <input type="text" className="form-control" id="usuario" value={adminData.userAdmin} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo:</label>
              <input type="text" className="form-control" id="correo" value={adminData.correo} readOnly />
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}

export default InfoAdmin;