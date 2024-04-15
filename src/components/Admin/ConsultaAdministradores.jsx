import React, { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import * as Yup from 'yup';


//RUTA DE LA API
const apiUrl = import.meta.env.VITE_API_URL;



// HOOKS PARA EL MANEJO DE ESTADOS DE ADMINISTRADORES AL MOMENTO DE EDITAR Y SELECCIONAR
const ConsultaAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const [editAdministradorId, setEditAdministradorId] = useState(null);
  const [selectedAdministrador, setSelectedAdministrador] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    userAdmin: '',
    email: '',
    password: '',
    status: true,
  });


  // CONSUMO DEL API - GET EN ADMINISTRADORES PARA LA OBTENCIION DE DATOS Y PINTARLOS EN LA TABLA
  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/`);
        setAdministradores(response.data.body);
      } catch (error) {
        console.error('Error al obtener las divisiones:', error);
      }
    };

    fetchAdministradores();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validationSchema = Yup.object().shape({
    name: Yup
      .string()
      .required('El nombre es requerido')
      .min(5, 'El nombre no puede tener menos de 5 caracteres'),
    apellido: Yup
      .string()
      .required('Los apellidos son requeridos')
      .min(5, 'Los apellidos no pueden tener menos de 5 caracteres'),
    userAdmin: Yup
      .string()
      .required('El usuario es requerido')
      .min(5, 'El usuario no puede tener menos de 5 caracteres')
      .test('existingUserAdmin', 'Usuario existente. Ingresa un nuevo usuario', function (value) {
        const lowerCaseUserAdmin = value.toLowerCase();
        return !administradores.find(administrador => administrador.userAdmin.toLowerCase() === lowerCaseUserAdmin);
      }),
    email: Yup
      .string()
      .required('El correo electrónico es requerido')
      .min(5, 'El correo electrónico no puede tener menos de 5 caracteres')
      .matches(emailRegex, 'El correo electrónico no tiene un formato válido')
      .test('emailExists', 'El correo electrónico ya está en uso', function (value) {
        return !administradores.some(administrador => administrador.email === value);
      }),
    password: Yup
      .string()
      .required('La contraseña es requerida')
      .min(8, 'La contraseña no puede tener menos de 8 caracteres')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?!.*\s).*$/,
        'La contraseña debe contener al menos 1 número, 1 letra mayúscula, 1 letra minúscula, 1 carácter especial y no debe contener espacios en blanco'
      )
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      apellido: '',
      userAdmin: '',
      email: '',
      password: '',
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleAdd(values);
    },
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
        Cell: ({ value, row }) => (
          <span className="badge" style={getCellStyle(value ? 'Activo' : 'Inactivo', row.original.status)}>
            {value ? 'Activo' : 'Inactivo'}
          </span>
        ),
      },
      {
        Header: 'Acciones',
        Cell: ({ row }) => (
          <Button variant="primary" size="sm" onClick={() => {
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

  const getCellStyle = (status) => {
    switch (status) {
      case "Activo":
        return {
          backgroundColor: "green",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      case "Inactivo":
        return {
          backgroundColor: "red",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      default:
        return {};
    }

  };




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

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
    setFormData({
      name: '',
      apellido: '',
      userAdmin: '',
      email: '',
      status: true,
    });
  };

  const handleShow = () => setShow(true);



  //CONSUMO DEL API - POST EN ADMINISTRADORES PARA AÑADIR NUEVOS DATOS DENTRO DEL MODAL
  const handleAdd = async () => {

    try {
      formData.status = true;
      const response = await axios.get(`${apiUrl}/admin/`);

      await axios.post(`${apiUrl}/admin/`, formik.values);
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
      const response = await axios.get(`${apiUrl}/admin/${id}`);
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
      // Si el estado del administrador se cambió a inactivo, mostrar alerta de confirmación
      if (selectedAdministrador.status === false) {
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Si desactivas al administrador perderá el acceso a la plataforma.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2D7541',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, desactivar administrador'
        });

        // Si el usuario cancela la acción, salir de la función
        if (!result.isConfirmed) {
          return;
        }
      }

      // Realizar la actualización del administrador en la base de datos utilizando el nuevo endpoint
      await axios.put(`${apiUrl}/admin/${editAdministradorId}`, selectedAdministrador);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Administrador modificado',
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
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <label>Nombre:</label>
                    <Form.Control
                      type="text"
                      placeholder=" "
                      maxLength="50"
                      {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-danger">{formik.errors.name}</div>
                    ) : null}
                  </Row>
                  <Row>
                    <label>Apellidos:</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      maxLength="50"
                      {...formik.getFieldProps('apellido')}
                    />
                    {formik.touched.apellido && formik.errors.apellido ? (
                      <div className="text-danger">{formik.errors.apellido}</div>
                    ) : null}
                  </Row>
                  <Row>
                    <label>Usuario:</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      maxLength="25"
                      {...formik.getFieldProps('userAdmin')}
                    />
                    {formik.touched.userAdmin && formik.errors.userAdmin ? (
                      <div className="text-danger">{formik.errors.userAdmin}</div>
                    ) : null}
                  </Row>
                  <Row>
                    <label>Correo electrónico:</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      maxLength="25"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                  </Row>
                  <Row>
                    <label>Contraseña:</label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      maxLength="12"
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-danger">{formik.errors.password}</div>
                    ) : null}
                  </Row>
                </Form>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={formik.handleSubmit}>
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
                    maxLength="50"
                    value={selectedAdministrador?.name || ''}
                    onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, name: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Apellido de el administrador:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    maxLength="50"
                    value={selectedAdministrador?.apellido || ''}
                    onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, apellido: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Usuario:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    maxLength="25"
                    value={selectedAdministrador?.userAdmin || ''}
                    onChange={(e) => setSelectedAdministrador({ ...selectedAdministrador, userAdmin: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Correo electrónico:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    maxLength="25"
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
              style={{ marginLeft: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
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
