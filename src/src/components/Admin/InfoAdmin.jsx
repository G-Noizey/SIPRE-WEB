import { useState } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";

function InfoAdmin() {
  const data = React.useMemo(
    () => [
      {
        nombre: "David Ivan",
        apellido: "Perez Torres",
        usuario: "adminMaster",
        telefono: "777 123 4567",
        direccion: "Av. Universidad, Emiliano Zapata",
        correo: "admin1@sipre.company.mx",
      },
    ],
    []
  );

  return (
    <>
      <div className="container-fluid p-3 my-3">
        <div className="row">
          <Form>
            {data.map((persona, index) => (
              <fieldset key={index}>
                <legend>Información de Administrador</legend>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre:</label>
                  <input type="text" className="form-control" id="nombre" value={persona.nombre} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="apellido" className="form-label">Apellidos:</label>
                  <input type="text" className="form-control" id="apellido" value={persona.apellido} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario:</label>
                  <input type="text" className="form-control" id="usuario" value={persona.usuario} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono:</label>
                  <input type="text" className="form-control" id="telefono" value={persona.telefono} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección:</label>
                  <input type="text" className="form-control" id="direccion" value={persona.direccion} readOnly />
                </div>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo:</label>
                  <input type="text" className="form-control" id="correo" value={persona.correo} readOnly />
                </div>
              </fieldset>
            ))}
          </Form>
        </div>
      </div>
    </>
  );
}


export default InfoAdmin;
