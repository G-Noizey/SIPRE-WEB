import React, { useState, useEffect } from 'react';
import { Button, Container, Modal, Row, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus, FaFileAlt } from "react-icons/fa"; // Importar el icono FaFileAlt
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import * as Yup from 'yup';


//RUTA DE LA API
const apiUrl = import.meta.env.VITE_API_URL;


const ConsultaDivisiones = () => {
  const [divisiones, setDivisiones] = useState([]);
  const [editDivisionId, setEditDivisionId] = useState(null); // Estado para almacenar el ID de la división en edición
  const [selectedDivision, setSelectedDivision] = useState(null); // Estado para almacenar la división seleccionada para edición
  const [formData, setFormData] = useState({
    name: '',
    siglas: '',
    saldo: '',
    status: true, // Establecer el status por defecto como true
  });

  useEffect(() => {
    const fetchDivisiones = async () => {
      try {
        const response = await axios.get(`${apiUrl}/division/`);
        setDivisiones(response.data.body);
      } catch (error) {
        console.error('Error al obtener las divisiones:', error);
      }
    };

    fetchDivisiones();
  }, []);


  const validationSchema = Yup.object().shape({
    name: Yup
      .string()
      .required('El nombre es requerido')
      .max(50, 'El nombre no puede tener más de 50 caracteres')
      .min(5, 'El nombre no puede tener menos de 5 caracteres')
      .test('existingName', 'Nombre existente. Ingresa un nuevo nombre', function (value) {
        const lowerCaseName = value.toLowerCase();
        return !divisiones.find(division => division.name.toLowerCase() === lowerCaseName);
      }),
    siglas: Yup
      .string()
      .required('Las siglas son requeridas')
      .max(6, 'Las siglas no pueden tener más de 6 caracteres')
      .min(2, 'Las siglas no pueden tener menos de 2 caracteres')
      .test('existingSiglas', 'Siglas existentes. Ingresa nuevas siglas', function (value) {
        const lowerCaseSiglas = value.toLowerCase();
        return !divisiones.find(division => division.siglas.toLowerCase() === lowerCaseSiglas);
      }),
    saldo: Yup
      .string()
      .required('El monto es requerido')
      .test('saldo-validation', 'El monto debe ser mayor que cero', saldo => {
        const saldoNumber = parseFloat(saldo);
        return saldoNumber > 0;
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      siglas: '',
      saldo: '',
      status: true
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleAdd(values);
    },
  });


  const generatePDF = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/buys/generatePDF/${id}`, {
        responseType: 'blob', // Indicar que la respuesta es un archivo binario
      });

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un enlace <a> y simular un clic para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compras.pdf');
      document.body.appendChild(link);
      link.click();

      // Liberar el objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };


  const columns = React.useMemo(
    () => [
      {
        Header: 'División',
        accessor: 'name',
      },
      {
        Header: 'Sigla',
        accessor: 'siglas',
      },
      {
        Header: 'Monto',
        accessor: 'saldo',
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
          <Button variant="success" size="sm" onClick={() => {
            console.log('Edit ID:', row.original.id);
            handleEditShow(row.original.id);
          }}>
            <AiFillEdit />
          </Button>

        ),
      },
      {
        Header: 'Estado de cuenta',
        Cell: ({ row }) => (
          <Button variant="success" size="sm" onClick={() => generatePDF(row.original.id)}>
            <FaFileAlt /> {/* Icono de PDF */}
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
          backgroundColor: "#198754",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      case "Inactivo":
        return {
          backgroundColor: "#888888",
          width: "100px", // Ancho fijo para el color de fondo
          height: "20px", // Alto fijo para el color de fondo
          borderRadius: "5px",
          color: "white",
        };
      default:
        return {};
    }

  };

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
      data: divisiones,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );



  const { globalFilter, pageIndex } = state;

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => {
    formik.resetForm();
    setShow(false);
    setFormData({
      name: '',
      siglas: '',
      saldo: '',
      status: true,
    });
  };

  const handleShow = () => {
    formik.resetForm();
    setFormData({
      name: '',
      siglas: '',
      saldo: '',
      status: true,
    });
    setShow(true);
  };


  const handleAdd = async () => {
    try {
      // Agregar status al formData
      formData.status = true;

      // Enviar el formulario con los datos de formik.values
      await axios.post(`${apiUrl}/division/`, formik.values);

      // Actualizar saldototal con el valor de saldo
      formik.values.saldototal = formik.values.saldo;

      // Mostrar alerta de éxito
      await Swal.fire({
        icon: 'success',
        title: 'División agregada',
        text: 'La división se agregó correctamente.',
        confirmButtonColor: '#2D7541',
        didClose: () => {
          // Recargar la página después de cerrar la alerta
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Error al agregar la división:', error);
      // Mostrar alerta de error
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar la división. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#2D7541',
      });
    }
    setShow(false);
  };



  const handleEditClose = () => {
    setShowEdit(false);
    setEditDivisionId(null); // Limpiar el ID de la división en edición
    setFormData({
      name: '',
      siglas: '',
      saldo: '',
      status: true,
    });
  };

  const handleEditShow = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/division/${id}`);
      setSelectedDivision(response.data.body);
      setEditDivisionId(id);
      setShowEdit(true);
    } catch (error) {
      console.error('Error al obtener la división para editar:', error);
    }
  };




  // Dentro de handleEditSave en ConsultaDivisiones.js

  const handleEditSave = async () => {
    try {
      if (selectedDivision.status === false) { // Verificar si el estado es inactivo
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Si inactivas la división, quitarás el saldo a todos los trabajadores que le pertenecen.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2D7541',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, inactivar división'
        });

        if (result.isConfirmed) { // Si el usuario confirma la acción
          // Enviar el formulario con los datos de selectedDivision
          const response = await axios.put(`${apiUrl}/division/${editDivisionId}`, selectedDivision);

          // Mostrar alerta de éxito
          await Swal.fire({
            icon: 'success',
            title: 'División modificada',
            text: response.data,
            confirmButtonColor: '#2D7541',
            didClose: () => {
              // Recargar la página después de cerrar la alerta
              window.location.reload();
            }
          });
        }
      } else { // Si el estado es diferente de inactivo
        // Enviar el formulario con los datos de selectedDivision
        const response = await axios.put(`${apiUrl}/division/${editDivisionId}`, selectedDivision);

        // Mostrar alerta de éxito
        await Swal.fire({
          icon: 'success',
          title: 'División modificada',
          text: response.data,
          confirmButtonColor: '#2D7541',
          didClose: () => {
            // Recargar la página después de cerrar la alerta
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error('Error al modificar la división:', error);
      // Mostrar alerta de error
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al modificar la división. Por favor, inténtalo de nuevo.',
        confirmButtonColor: '#2D7541',
      });
    }
    setShowEdit(false);
  };



  return (
    <>
      <div className='container-fluid p-3 my-3'>
        <div className='row'>
          <div className='col-6'>
            <Button variant="success" onClick={handleShow}>Añadir División <FaPlus /></Button>
          </div>

          {/* Modal para agregar división */}

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir división</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <label>Nombre de la división:</label>
                    <Form.Control
                      type="text"
                      maxLength="50"
                      placeholder=""
                      {...formik.getFieldProps('name')}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-danger">{formik.errors.name}</div>
                    ) : null}
                  </Row>
                  <Row>
                    <label>Siglas:</label>
                    <Form.Control
                      type="text"
                      maxLength="6"
                      placeholder=""
                      {...formik.getFieldProps('siglas')}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        formik.setFieldValue('siglas', value);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.siglas && formik.errors.siglas ? (
                      <div className="text-danger">{formik.errors.siglas}</div>
                    ) : null}
                  </Row>
                  <Row>
                    <label>Monto:</label>
                    <Form.Control
                      type="text"
                      maxLength="8"
                      placeholder=""
                      {...formik.getFieldProps('saldo')}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
                          return; // Permitir estas teclas sin restricciones
                        }
                        const regex = /^[0-9.]$/; // Permitir solo números y el punto decimal
                        if (!regex.test(e.key)) {
                          e.preventDefault(); // Evitar la entrada de otros caracteres
                        }
                      }}
                    />
                    {formik.touched.saldo && formik.errors && formik.errors.saldo ? (
                      <div className="text-danger">{formik.errors.saldo}</div>
                    ) : null}

                  </Row>

                </Form>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={formik.handleSubmit}>Crear</Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de edición */}
          <Modal show={showEdit} onHide={handleEditClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modificar división</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre de la división:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    maxLength="50"
                    value={selectedDivision?.name || ''}
                    onChange={(e) => setSelectedDivision({ ...selectedDivision, name: e.target.value })}
                    disabled={selectedDivision?.status === false}
                  />
                </Row>
                <Row>
                  <label>Siglas:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    maxLength="6"
                    value={selectedDivision?.siglas || ''}
                    onChange={(e) => setSelectedDivision({ ...selectedDivision, siglas: e.target.value })}
                    disabled={selectedDivision?.status === false}
                  />
                </Row>
                <Row>
                  <Form.Control
                    type="hidden"
                    placeholder=""
                    value={selectedDivision?.saldo || ''}
                    onChange={(e) => setSelectedDivision({ ...selectedDivision, saldo: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Estatus:</label>
                  <Form.Control
                    as="select"
                    value={selectedDivision?.status ? 'Activo' : 'Inactivo'}
                    onChange={(e) => setSelectedDivision({ ...selectedDivision, status: e.target.value === 'Activo' })}
                    disabled={false} // Permitir que este control siempre sea modificable
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </Form.Control>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleEditSave}>Guardar cambios</Button>
            </Modal.Footer>
          </Modal>

          <div className='col-6 d-flex justify-content-end'>
            <input
              type="text"
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Buscar División"
              style={{ marginLeft: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </div>
        </div>
      </div>

      <div className='container-fluid p-3 my-3'>
        <div className='row'>
          <div className='col-12'>
            <table {...getTableProps()} style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th className='text-center' {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className='text-center' {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row);
                  return (
                    <React.Fragment key={row.id}>
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                        })}
                      </tr>
                      <tr key={`${row.id}-divider`}>
                        <td colSpan={6} style={{ borderBottom: '1px solid #ccc' }}></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pageOptions.length > 1 && (
            <div className='col-12 p-3 mt-3 d-flex justify-content-end'>
              <Button variant='success' onClick={() => previousPage()} disabled={!canPreviousPage}>
                <HiArrowSmLeft />
              </Button>{' '}
              <Button variant='success' onClick={() => nextPage()} disabled={!canNextPage}>
                <HiArrowSmRight />
              </Button>{' '}
              <span style={{ marginLeft: '10px' }}>
                Página{' '}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>{' '}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultaDivisiones;
