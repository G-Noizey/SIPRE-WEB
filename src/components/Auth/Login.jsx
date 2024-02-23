import React, { useState, useEffect } from 'react';

const Login = () => {
  // Estado de los campos
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estado para mensajes de error y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Función para enviar la información de login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviar la información de login al backend
    // ...

    if (login exitoso) {
      setSuccess('Inicio de sesión exitoso');
      // Redirigir a la página principal
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  // Renderizado del componente
  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Usuario:</label>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Iniciar sesión</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Login;
