import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleIniciar = () => {
    axios
      .post("http://localhost:8080/admin/login", {
        userAdmin: username,
        password,
      })
      .then((response) => {
        const { status, ...responseData } = response.data;

        if (status === "error") {
          // Si el servidor devuelve un estado "error", muestra un mensaje de error genérico
          Swal.fire({
            icon: "error",
            title: "¡Error al iniciar sesión!",
            text: "Hubo un problema al intentar iniciar sesión.",
            confirmButtonColor: "#2D7541",
          });
        } else if (status === 0) {
          // Si el estado es "0" (inactivo), muestra un mensaje de cuenta desactivada
          Swal.fire({
            icon: "warning",
            title: "¡Acceso denegado!",
            text: "Tu cuenta está desactivada. Por favor, contacta al administrador.",
            confirmButtonColor: "#2D7541",
          });
        } else {
          // Si todo está bien, guarda los datos del usuario en el almacenamiento local y redirige
          localStorage.setItem("token", responseData.token);
          localStorage.setItem("role", responseData.role);
          // Después de un inicio de sesión exitoso, se almacenan los datos del usuario en el almacenamiento local
          localStorage.setItem("name", responseData.name);
          localStorage.setItem("apellido", responseData.apellido);
          localStorage.setItem("userAdmin", responseData.userAdmin);
          localStorage.setItem("email", responseData.email);

          // Si la cuenta no está inactiva, muestra el mensaje de inicio de sesión exitoso
          Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Bienvenido",
            confirmButtonColor: "#2D7541",
          }).then(() => {
            navigate("/dashboard/divisiones");
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          // Si el servidor devuelve un estado 403 (Prohibido), muestra un mensaje de cuenta desactivada
          Swal.fire({
            icon: "warning",
            title: "¡Acceso denegado!",
            text: "Tu cuenta está desactivada. Por favor, contacta al administrador.",
            confirmButtonColor: "#2D7541",
          });
        } else {
          // Manejo de otros errores
          Swal.fire({
            icon: "error",
            title: "¡Error al iniciar sesión!",
            text: "Hubo un problema al intentar iniciar sesión",
            confirmButtonColor: "#2D7541",
          });
        }
      });
  };

  const handleRecuperar = () => {
    navigate("/recuperar");
  };

  return (
    <section
      className="vh-100"
      style={{ backgroundColor: "white", fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="row g-0">
                <div
                  className="col-md-6 col-lg-5 d-none d-md-block"
                  style={{ backgroundColor: "#2D7541" }}
                >
                  <img
                    src="../../public/assets/images/SIPRE 1.png"
                    alt="login form"
                    className="img-fluid"
                    style={{ width: "250px", margin: "140px 100px" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black text-center">
                    <form>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <img
                          src="../../public/assets/images/logo2.png"
                          alt="Descripción de la imagen"
                          style={{ width: "100px" }}
                        />
                      </div>
                      <h1
                        className=" mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Iniciar Sesión
                      </h1>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="username"
                          className="form-control form-control-lg"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="form-label" htmlFor="username">
                          Usuario
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="password">
                          Contraseña
                        </label>
                      </div>
                      <div className="form-outline mb-4">
                        <Link className="small text-muted" to="/recuperar">
                          {" "}
                          ¿Olvidaste tu contraseña?{" "}
                        </Link>
                      </div>
                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-lg shadow-lg"
                          type="button"
                          style={{
                            backgroundColor: "#2D7541",
                            color: "white",
                            padding: "5px 150px",
                            margin: "10px",
                          }}
                          onClick={handleIniciar}
                        >
                          Iniciar
                        </button>
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
