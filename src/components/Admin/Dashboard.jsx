import React from 'react';
import { FaList, FaUsers, FaUserTie, FaChartPie, FaRegUserCircle} from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';



import { IoIosLogOut } from "react-icons/io";


const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-2 sidebar" style={{ backgroundColor: 'white', borderRight: '2px solid #ddd', height: '100vh', paddingTop: '30px', boxShadow: '2px 0px 4px rgba(0,0,0,0.1)' }}>

          <div className="  container-fluid ">
            <div className="row  ">
              <div className="col-2">
                <img src="../../../public/assets/images/SIPRE 1.png" alt="Logo" style={{ width: '100px', marginBottom: '10px', paddingRight: '30px'   }} />
              </div>
              <div className="col-10">
                <h2 className="text-center fw-bold" style={{ fontSize: '1.7em', marginBottom: '5px', marginLeft: '40px', marginBottom: '10px' }}  >SIPRE</h2>
                <p className="text-center" style={{ color: 'grey', fontSize: '0.7em', marginLeft: '40px'}}>Prestamos empresariales</p>
              </div>
            </div>
          </div>

          <ul className="nav flex-column">

            <p className='fw-bold'  style={{color: 'grey', padding: '5px'}}  >  Gestión   </p>

            <li className="nav-item">
 

            <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/divisiones"
              >
                <FaList style={{ color: '#2D7541', marginRight: '20px', fontSize: '1.2em' }} />
                <span style={{ color: '#2D7541' }}>Divisiones</span>
              </Link>


            </li>


           

            <li className="nav-item">

            <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard/trabajadores"
              >
                <FaUsers style={{ color: '#2D7541', marginRight: '20px', fontSize: '1.2em' }} />
                <span style={{ color: '#2D7541' }}>Trabajadores</span>
              </Link>


            </li>
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center" href="#">
                <FaUserTie style={{ color: '#2D7541', marginRight: '20px', fontSize: '1.2em' }}/> <span style={{ color: '#2D7541' }}>Administradores</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center" href="#">
                <FaChartPie style={{ color: '#2D7541', marginRight: '20px', fontSize: '1.2em' }}/> <span style={{ color: '#2D7541' }}>Centro de Reporte</span>
              </a>
            </li>

            <p className='fw-bold'  style={{color: 'grey', padding: '10px'}}  >  Usuario:   </p>
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center" href="#">
                <FaRegUserCircle  style={{ color: '#2D7541', marginRight: '20px', fontSize: '1.2em' }}/> <span style={{ color: '#2D7541' }}>Nombre de usuario logeado</span>
              </a>
            </li>



          </ul>
        </div>

        {/* Main content */}
        <div className="col-lg-10">
          <nav className="navbar navbar-light" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="container-fluid">
              <h2 className="navbar-brand" style={{ color: '#2D7541', padding: '10px', margin: '20px'  }}>Administración</h2>
              
              
              <div>
                <a> 
                <IoIosLogOut   style={{  marginRight: '10px', fontSize: '1.5em' }}/> <span>Cerrar Sesión</span>
                </a>
              </div>

              



            </div>
          </nav>


          <div className="container-fluid">

          <div className="content" style={{ padding: '20px' }}>

          <Outlet />  {/* Outlet para rutas hijas */}



            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
