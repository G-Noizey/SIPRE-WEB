import React from 'react';
import Swal from 'sweetalert2';

const Alert = ({ type, title, text }) => {
  Swal.fire({
    icon: type,
    title: title,
    text: text,
  });

  return null; // El componente no renderiza nada, solo muestra la alerta
};

export default Alert;
