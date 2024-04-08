import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Modal, Row, Form, InputGroup } from "react-bootstrap";

import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";



//RUTA DE LA API
const apiUrl = import.meta.env.VITE_API_URL;

function InfoAdmin() {
  const [adminData, setAdminData] = useState({
    nombre: '',
    apellido: '',
    userAdmin: '',
    correo: '',
    id:'',
  });
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  

  useEffect(() => {
    // Obtener la información del administrador del almacenamiento local al cargar el componente
    const storedName = localStorage.getItem('name');
    const storedApellido = localStorage.getItem('apellido');
    const storedUserAdmin = localStorage.getItem('userAdmin');
    const storedCorreo = localStorage.getItem('email');
    const storedId = localStorage.getItem('id');
  
    // Actualizar el estado con la información del administrador
    setAdminData({
      nombre: storedName || '',
      apellido: storedApellido || '',
      userAdmin: storedUserAdmin || '',
      correo: storedCorreo || '',
      id: storedId || '',
    });
  }, []);
  
  const handleUsernameChange = async () => {
    if (newUsername.trim() === '') {
      // Mostrar alerta de error si el campo de nombre de usuario está vacío
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese un nuevo nombre de usuario',
      });
      return; // No procedemos con la actualización si el campo está vacío
    }
  
    // Mostrar confirmación antes de realizar la actualización
    const confirmed = await Swal.fire({
      title: '¿Está seguro de modificar su nombre de usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#989898',
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'Cancelar'
    });
  
    if (!confirmed.value) {
      return; // Si el usuario cancela, no procedemos con la actualización
    }
  
    try {
      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Nombre de usuario actualizado con éxito',
        showConfirmButton: false,
        timer: 1500
      });
  
      // Realizar solicitud PUT para actualizar el nombre de usuario
      await axios.put(`${apiUrl}/admin/${adminData.id}/update-username`, null, { params: { newUsername: newUsername } });
      
      // Actualizar los datos en el almacenamiento local
      localStorage.setItem('userAdmin', newUsername);
      window.location.reload();
  
      // Cerrar el modal y limpiar el estado
      setShowModal(false);
      setNewUsername('');
    } catch (error) {
      console.error("Error al actualizar el nombre de usuario:", error);
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar el nombre de usuario. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#3085d6'
      });
    }
  };
  
  const handlePasswordChange = async () => {
    // Validar que la contraseña actual no esté vacía
    if (newPassword.trim() === '') {
      // Mostrar alerta de error si el campo de contraseña actual está vacío
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese la contraseña nueva',
      });
      return;
    }
  
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
  
    // Validar que la nueva contraseña no esté vacía
    if (newPassword.trim() === '') {
      // Mostrar alerta de error si el campo de nueva contraseña está vacío
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese la nueva contraseña',
      });
      return;
    }
  
    try {
      // Realizar solicitud PUT para actualizar la contraseña
      await axios.put(`${apiUrl}/admin/${adminData.id}/update-password`, null, { params: { newPassword } });
  
      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada con éxito',
        showConfirmButton: false,
        timer: 1500
      });
  
      // Cerrar el modal y limpiar el estado
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setError("");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      // Mostrar alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#3085d6'
      });
    }
  };
  
  
  return (
    <div className="container-fluid p-3 my-3">
      <div className="row">
        <Form>
          <fieldset>
            <legend>Información de Administrador</legend>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input type="text" className="form-control" id="nombre" value={adminData.nombre} readOnly disabled/>
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellidos:</label>
              <input type="text" className="form-control" id="apellido" value={adminData.apellido} readOnly disabled/>
            </div>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario:</label>
              <input type="text" className="form-control" id="usuario" value={adminData.userAdmin} readOnly disabled/>
            </div>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo:</label>
              <input type="text" className="form-control" id="correo" value={adminData.correo} readOnly disabled/>
            </div>
          </fieldset>
        </Form>
        <Button variant="success" onClick={() => setShowUsernameModal(true)} style={{ width: '400px', marginLeft:'10px' }}>Cambiar nombre de usuario</Button>
<Button variant="success" onClick={() => setShowPasswordModal(true)} style={{ width: '400px', marginLeft:'362px' }}>Cambiar contraseña</Button>

        <Modal show={showUsernameModal} onHide={() => setShowUsernameModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Cambiar nombre de usuario</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group controlId="formNewUsername">
      <Form.Label>Nuevo nombre de usuario</Form.Label>
      <Form.Control type="text" placeholder="Ingrese el nuevo nombre de usuario" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUsernameModal(false)}>Cancelar</Button>
    <Button variant="success" onClick={handleUsernameChange}>Guardar cambios</Button>
  </Modal.Footer>
</Modal>


<Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Cambiar contraseña</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form.Group controlId="formNewPassword">
    <Form.Label>Nueva contraseña</Form.Label>
    <InputGroup>
      <Form.Control type={showPassword ? "text" : "password"} placeholder="Ingrese la nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </InputGroup.Text>
    </InputGroup>
  </Form.Group>
  <Form.Group controlId="formConfirmNewPassword">
    <Form.Label>Confirmar nueva contraseña</Form.Label>
    <InputGroup>
      <Form.Control type={showConfirmPassword ? "text" : "password"} placeholder="Confirme la nueva contraseña" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
      <InputGroup.Text onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
      </InputGroup.Text>
    </InputGroup>
  </Form.Group>
</Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
    <Button variant="success" onClick={handlePasswordChange}>Guardar cambios</Button>
  </Modal.Footer>
  {error && <div className="alert alert-secondary mt-3" role="alert">{error}</div>}
</Modal>


      </div>
    </div>
  );
}

export default InfoAdmin;
