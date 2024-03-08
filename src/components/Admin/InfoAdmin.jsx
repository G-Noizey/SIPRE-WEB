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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre:</Form.Label><br/>
                <Form.Control value={persona.nombre}/><br/>
                <Form.Label>Apellidos:</Form.Label><br/>
                <Form.Control value={persona.apellido}/><br/>
                <Form.Label>Usuario:</Form.Label><br/>
                <Form.Control value={persona.usuario}/><br/>
                <Form.Label>Telefono:</Form.Label><br/>
                <Form.Control value={persona.telefono}/><br/>
                <Form.Label>Direccion:</Form.Label><br/>
                <Form.Control value={persona.direccion}/><br/>
                <Form.Label>Correo:</Form.Label><br/>
                <Form.Control value={persona.correo}/><br/>
              </Form.Group>
            ))}
          </Form>
        </div>
      </div>
    </>
  );
}

export default InfoAdmin;
