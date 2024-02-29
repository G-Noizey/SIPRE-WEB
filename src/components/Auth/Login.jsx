
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const navigate = useNavigate();


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleIniciar = () => {
    navigate('/dashboard');
  };


  return (
    <section className="vh-100" style={{ backgroundColor: 'white', fontFamily: 'Montserrat, sans-serif' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block" style={{ backgroundColor: '#2D7541' }}>
                  <img src="../../public/assets/images/SIPRE 1.png" alt="login form" className="img-fluid" style={{ width: '250px', margin: '140px 100px' }} />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black text-center">
                    <form>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                        <img src="../../public/assets/images/logo2.png" alt="Descripción de la imagen" style={{ width: '100px' }} />
                      </div>
                      <h1 className=" mb-3 pb-3" style={{ letterSpacing: '1px'}}>Iniciar Sesión</h1>
                      <div className="form-outline mb-4">
                        <input type="email" id="form2Example17" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="form2Example17">Usuario</label>
                      </div>
                      <div className="form-outline mb-4">
                        <input type="password" id="form2Example27" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="form2Example27">Contraseña</label>
                      </div>
                      <div className="form-outline mb-4">
                        <a className="small text-muted" href="#!">¿Olvidaste tu contraseña?</a>
                      </div>
                      <div className="pt-1 mb-4">
<button className="btn btn-lg shadow-lg" type="button" style={{ backgroundColor: '#2D7541', color: 'white', padding: '5px 150px', margin: '10px' }} onClick={handleIniciar}>Iniciar</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



  );
};

export default Login;