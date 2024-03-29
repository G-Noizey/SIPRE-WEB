import React, { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from 'axios';
import Swal from 'sweetalert2';

// HOOKS PARA EL MANEJO DE ESTADOS DE ADMINISTRADORES AL MOMENTO DE EDITAR Y SELECCIONAR
const ConsultaAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [editAdministradorId, setEditAdministradorId] = useState(null); 
  const [selectedAdministrador, setSelectedAdministrador] = useState(null);

  // CONSUMO DEL API - GET EN ADMINISTRADORES PARA LA OBTENCIION DE DATOS Y PINTARLOS EN LA TABLA
  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/');
        setAdministradores(response.data.body);
      } catch (error) {
        console.error('Error al obtener las divisiones:', error);
      }
    };

    fetchAdministradores();
  }, []);


   // Estado para el formulario de añadir/editar administrador
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    userAdmin: '',
    email: '',
    status: true, 
  });
  
  // ESTRUCTURACIÓN DE LA TABLA
    
  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'name',
      },
      {
        Header: 'Apellido',
        accessor: 'apellido',
      },
      {
        Header: 'Usuario',
        accessor: 'userAdmin',
      },
      {
        Header: 'Correo',
        accessor: 'email',
      },
      {
        Header: 'Estatus',
        accessor: 'status',
        Cell: ({ value }) => (value ? 'Activo' : 'Inactivo'),
      },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <Button variant="success" size="sm" onClick={() => {
            console.log('Edit ID:', row.original.id);
            handleEditShow(row.original.id);
          }}>
            <AiFillEdit />
          </Button>
          
        ),
      },
   
    ],
    []
  );



    // Hooks de react-table para configurar la tabla y la paginación

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions,
      state,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data: administradores,
        initialState: { pageSize: 10 },
      },
      useGlobalFilter,
      usePagination
    );

    const { globalFilter, pageIndex } = state;


    // Estado y funciones para manejar modales

    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



  //CONSUMO DEL API - POST EN ADMINISTRADORES PARA AÑADIR NUEVOS DATOS DENTRO DEL MODAL
  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:8080/admin/', formData);
      // Mostrar alerta de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Administrador agregado',
        text: 'El administrador se agregó correctamente.',
        confirmButtonColor: '#2D7541',
        didClose: () => {
          // Recargar la página después de cerrar la alerta
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Error al agregar el administrador:', error);
      // Mostrar alerta de error
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar al administrador. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#2D7541',
      });
    }
    setShow(false);
  };


  // FUNCION PARA CERRAR MODAL DE EDICIÓN DE ADMINISTRADORES Y LIMPIAR LOS INPUTS

  const handleEditClose = () => {
    setShowEdit(false);
    setEditAdministradorId(null); // Limpiar el ID de la división en edición
    setFormData({
    name: '',
    apellido: '',
    userAdmin: '',
    email: '',
    status: true, 
    });
  };


  //CONSUMO DEL API - GET BY ID EN ADMINISTRADORES PARA LA OBTENCIÓN DE DATOS EN EL MODAL
  const handleEditShow = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/admin/${id}`);
      setSelectedAdministrador(response.data.body);
      setEditAdministradorId(id);
      setShowEdit(true);
    } catch (error) {
      console.error('Error al obtener el administrador para editar:', error);
    }
  };

   // CONSUMO DEL API - PUT EN ADMINISTRADORES
  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:8080/admin/${editAdministradorId}`, selectedAdministrador);
      // Mostrar alerta de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Administrador modificada',
        text: 'El administrador se modificó correctamente.',
        confirmButtonColor: '#2D7541',
        didClose: () => {
          // Recargar la página después de cerrar la alerta
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Error al modificar el administrador:', error);
      // Mostrar alerta de error
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al modificar al administrador. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#2D7541',
      });
    }
    setShowEdit(false);
  };


  // RENDERIZACIÓN DEL COMPONENTE

  return (
    <>
      <div className="container-fluid p-3 my-3">
        <div className="row">
          <div className="col-6">
            <Button variant="success" onClick={handleShow}>
              Añadir Administrador <FaPlus />
            </Button>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir Administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre:</label>
                  <Form.Control 
                  type="text" 
                  placeholder=" " 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Apellidos:</label>
                  <Form.Control 
                  type="text" 
                  placeholder="" 
                  value={formData.apellido}
                   onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Usuario:</label>
                  <Form.Control 
                  type="text" 
                  placeholder="" 
                  value={formData.userAdmin}
                  onChange={(e) => setFormData({ ...formData, userAdmin: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Correo Electrónico:</label>
                  <Form.Control 
                  type="text" 
                  placeholder="" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Contraseña:</label>
                  <Form.Control 
                  type="text" 
                  placeholder="" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Row>
             
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleAdd}>
                Crear
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showEdit} onHide={handleEditClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modificar administrador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
              <Row>
              <label>Nombre de el administrador:</label>
              <Form.Control
                type="text"
                placeholder=""
                value={selectedAdministrador?.name || ''}
                onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, name: e.target.value })}
              />
            </Row>
            <Row>
              <label>Apellido de el administrador:</label>
              <Form.Control
                type="text"
                placeholder=""
                value={selectedAdministrador?.apellido   || ''}
                onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, apellido: e.target.value })}
              />
            </Row>
            <Row>
              <label>Usuario:</label>
              <Form.Control
                type="text"
                placeholder=""
                value={selectedAdministrador?.userAdmin || ''}
                onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, userAdmin: e.target.value })}
              />
            </Row>
            <Row>
              <label>Correo Electrónico:</label>
              <Form.Control
                type="text"
                placeholder=""
                value={selectedAdministrador?.email || ''}
                onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, email: e.target.value })}
              />
            </Row>
           
            <Row>
              <label>Estatus:</label>
              <Form.Control
                as="select"
                value={selectedAdministrador?.status ? 'Activo' : 'Inactivo'}
                onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, status: e.target.value === 'Activo' })}
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleEditSave}>
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="col-6 d-flex justify-content-end">
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar Administrador"
              style={{ marginLeft: "10px", borderRadius: "5px", border: "1px solid #ccc"}}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid p-3 my-3">
        <div className="row">
          <div className="col-12">
            <table
              {...getTableProps()}
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <thead className="justify-content-center">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th className="text-center" {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="text-center" {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <React.Fragment key={row.id}>
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                      <tr key={`${row.id}-divider`}>
                        <td
                          colSpan={6}
                          style={{ borderBottom: "1px solid #ccc" }}
                        ></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pageOptions.length > 1 && (
            <div className="col-12 p-3 mt-3 d-flex justify-content-end">
              <Button
                variant="success"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <HiArrowSmLeft />
              </Button>{" "}
              <Button
                variant="success"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <HiArrowSmRight />
              </Button>{" "}
              <span style={{ marginLeft: "10px" }}>
                Página{" "}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>{" "}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default ConsultaAdministradores;
