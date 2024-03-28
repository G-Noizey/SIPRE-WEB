import {
  FaList,
  FaUsers,
  FaUserTie,
  FaChartPie,
  FaRegUserCircle,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import Swal from "sweetalert2"; // Importa SweetAlert
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [isDivisionHover, setIsDivisionHover] = useState(false);
  const [isTrabajadoresHover, setIsTrabajadoresHover] = useState(false);
  const [isAdministradoresHover, setIsAdministradoresHover] = useState(false);
  const [isReporteHover, setIsReporteHover] = useState(false);
  const [isUsuarioHover, setIsUsuarioHover] = useState(false);
  const [isLogoutHover, setIsLogoutHover] = useState(false);
  const [isComprasHover, setIsComprasHover] = useState(false);
  const [isTransaccionesHover, setIsTransaccionesHover] = useState(false);

  const [userRole, setUserRole] = useState(0); // Suponiendo que el rol 0 significa no definido o no autorizado

  useEffect(() => {
    // Obtener el rol del usuario del almacenamiento local
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(parseInt(storedRole)); // Convertir a entero
    }
  }, []);

  const handleHover = (stateSetter) => {
    stateSetter(true);
  };

  const handleMouseOut = (stateSetter) => {
    stateSetter(false);
  };
  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cerrará tu sesión actual",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2D7541",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("name");
        localStorage.removeItem("apellido");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        navigate("/"); // Redirige al usuario a la pantalla de inicio de sesión
      }
    });
  };
  // Obtener el nombre y apellido del localStorage
  const storedName = localStorage.getItem("name");
  const storedApellido = localStorage.getItem("apellido");

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div
          className="col-lg-2 sidebar"
          style={{
            backgroundColor: "white",
            borderRight: "2px solid #ddd",
            height: "100vh",
            paddingTop: "30px",
            boxShadow: "2px 0px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div className="  container-fluid ">
            <div className="row  ">
              <div className="col-2">
                <img
                  src="../../../public/assets/images/SIPRE 1.png"
                  alt="Logo"
                  style={{
                    width: "100px",
                    marginBottom: "10px",
                    paddingRight: "30px",
                  }}
                />
              </div>
              <div className="col-10">
                <h2
                  className="text-center fw-bold"
                  style={{
                    fontSize: "1.7em",
                    marginBottom: "5px",
                    marginLeft: "40px",
                    marginBottom: "10px",
                  }}
                >
                  SIPRE
                </h2>
                <p
                  className="text-center"
                  style={{
                    color: "grey",
                    fontSize: "0.7em",
                    marginLeft: "40px",
                  }}
                >
                  Prestamos empresariales
                </p>
              </div>
            </div>
          </div>

          <ul className="nav flex-column">
            <p className="fw-bold" style={{ color: "grey", padding: "5px" }}>
              {" "}
              Gestión{" "}
            </p>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/divisiones"
                onMouseEnter={() => handleHover(setIsDivisionHover)}
                onMouseLeave={() => handleMouseOut(setIsDivisionHover)}
                style={{
                  borderLeft: isDivisionHover ? "6px solid #2D7541" : "#2D7541",
                  backgroundColor: isDivisionHover ? "#f4f4f4" : "transparent",
                  paddingLeft: "16px",
                }}
              >
                <FaList
                  style={{
                    color: "#2D7541",
                    marginRight: "20px",
                    fontSize: "1.2em",
                  }}
                />
                <span style={{ color: "#2D7541" }}>Divisiones</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/trabajadores"
                onMouseEnter={() => handleHover(setIsTrabajadoresHover)}
                onMouseLeave={() => handleMouseOut(setIsTrabajadoresHover)}
                style={{
                  borderLeft: isTrabajadoresHover
                    ? "6px solid #2D7541"
                    : "#2D7541",
                  backgroundColor: isTrabajadoresHover
                    ? "#f4f4f4"
                    : "transparent",
                  paddingLeft: "16px",
                }}
              >
                <FaUsers
                  style={{
                    color: "#2D7541",
                    marginRight: "20px",
                    fontSize: "1.2em",
                  }}
                />
                <span style={{ color: "#2D7541" }}>Trabajadores</span>
              </Link>
            </li>

            {userRole === 2 && (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/dashboard/administradores"
                  onMouseEnter={() => handleHover(setIsAdministradoresHover)}
                  onMouseLeave={() => handleMouseOut(setIsAdministradoresHover)}
                  style={{
                    borderLeft: isAdministradoresHover
                      ? "6px solid #2D7541"
                      : "#2D7541",
                    backgroundColor: isAdministradoresHover
                      ? "#f4f4f4"
                      : "transparent",
                    paddingLeft: "16px",
                  }}
                >
                  <FaUserTie
                    style={{
                      color: "#2D7541",
                      marginRight: "20px",
                      fontSize: "1.2em",
                    }}
                  />{" "}
                  <span style={{ color: "#2D7541" }}>Administradores</span>
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/reporte"
                onMouseEnter={() => handleHover(setIsReporteHover)}
                onMouseLeave={() => handleMouseOut(setIsReporteHover)}
                style={{
                  borderLeft: isReporteHover ? "6px solid #2D7541" : "#2D7541",
                  backgroundColor: isReporteHover ? "#f4f4f4" : "transparent",
                  paddingLeft: "16px",
                }}
              >
                <FaChartPie
                  style={{
                    color: "#2D7541",
                    marginRight: "20px",
                    fontSize: "1.2em",
                  }}
                />{" "}
                <span style={{ color: "#2D7541" }}>Centro de Reporte</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/compras"
                onMouseEnter={() => handleHover(setIsComprasHover)}
                onMouseLeave={() => handleMouseOut(setIsComprasHover)}
                style={{
                  borderLeft: isComprasHover ? "6px solid #2D7541" : "#2D7541",
                  backgroundColor: isComprasHover ? "#f4f4f4" : "transparent",
                  paddingLeft: "16px",
                }}
              >
                <FaShoppingBag
                  style={{
                    color: "#2D7541",
                    marginRight: "20px",
                    fontSize: "1.2em",
                  }}
                />{" "}
                <span style={{ color: "#2D7541" }}>Compras</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/transacciones"
                onMouseEnter={() => handleHover(setIsTransaccionesHover)}
                onMouseLeave={() => handleMouseOut(setIsTransaccionesHover)}
                style={{
                  borderLeft: isTransaccionesHover
                    ? "6px solid #2D7541"
                    : "#2D7541",
                  backgroundColor: isTransaccionesHover
                    ? "#f4f4f4"
                    : "transparent",
                  paddingLeft: "16px",
                }}
              >
                <FaCreditCard
                  style={{
                    color: "#2D7541",
                    marginRight: "20px",
                    fontSize: "1.2em",
                  }}
                />{" "}
                <span style={{ color: "#2D7541" }}>Transacciones</span>
              </Link>
            </li>

            <p className="fw-bold" style={{ color: "grey", padding: "10px" }}>
              {" "}
              Usuario:{" "}
            </p>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/infoadmin"
                onMouseEnter={() => handleHover(setIsUsuarioHover)}
                onMouseLeave={() => handleMouseOut(setIsUsuarioHover)}
                style={{
                  borderLeft: isUsuarioHover ? "6px solid #2D7541" : "#2D7541",
                  backgroundColor: isUsuarioHover ? "#f4f4f4" : "transparent",
                  paddingLeft: "16px",
                }}
              >
                <FaRegUserCircle
                  style={{
                    color: "#2D7541",
                    marginRight: "20px",
                    fontSize: "1.2em",
                  }}
                />{" "}
                <span style={{ color: "#2D7541" }}>
                  {storedName} {storedApellido}{" "}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="col-lg-10">
          <nav
            className="navbar navbar-light"
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div className="container-fluid">
              <h2
                className="navbar-brand"
                style={{ color: "#2D7541", padding: "10px", margin: "20px" }}
              >
                Administración
              </h2>

              <div>
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => handleHover(setIsLogoutHover)}
                  onMouseLeave={() => handleMouseOut(setIsLogoutHover)}
                  style={{
                    border: isLogoutHover ? "2px solid #2D7541" : "none",
                    backgroundColor: isLogoutHover ? "#white" : "transparent",
                    borderRadius: isLogoutHover ? "5px" : "0",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    display: "block",
                  }}
                >
                  <IoIosLogOut
                    style={{ marginRight: "10px", fontSize: "1.5em" }}
                  />{" "}
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </nav>

          <div className="container-fluid">
            <div className="content" style={{ padding: "20px" }}>
              <Outlet /> {/* Outlet para rutas hijas */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
