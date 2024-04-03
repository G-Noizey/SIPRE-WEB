import React, { useState, useEffect } from 'react';
import { Button, Container, Modal, Row, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus, FaFileAlt } from "react-icons/fa"; // Importar el icono FaFileAlt
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';
import Swal from 'sweetalert2';


const ConsultaDivisiones = () => {
  const [divisiones, setDivisiones] = useState([]);
  const [editDivisionId, setEditDivisionId] = useState(null); // Estado para almacenar el ID de la división en edición
  const [selectedDivision, setSelectedDivision] = useState(null); // Estado para almacenar la división seleccionada para edición

  useEffect(() => {
    const fetchDivisiones = async () => {
      try {
        const response = await axios.get('http://localhost:8080/division/');
        setDivisiones(response.data.body);
      } catch (error) {
        console.error('Error al obtener las divisiones:', error);
      }
    };

    fetchDivisiones();
  }, []);



  const [formData, setFormData] = useState({
    name: '',
    siglas: '',
    saldo: '',
    status: true, // Establecer el status por defecto como true
  });
  
  const generatePDF = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/buys/generatePDF/${id}`, {
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAdd = async () => {
    try {
      // Enviar el formulario con los datos de formData
      const response = await axios.post('http://localhost:8080/division/', formData);
  
      // Actualizar saldototal con el valor de saldo
      formData.saldototal = formData.saldo;
  
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
      const response = await axios.get(`http://localhost:8080/division/${id}`);
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
      // Enviar el formulario con los datos de selectedDivision
      const response = await axios.put(`http://localhost:8080/division/${editDivisionId}`, selectedDivision);

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
                <Row>
                  <label>Nombre de la división:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Siglas:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.siglas}
                    onChange={(e) => setFormData({ ...formData, siglas: e.target.value })}
                  />
                </Row>
                <Row>
                  <label>Monto:</label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={formData.saldo}
                    onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
                  />
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleAdd}>Crear</Button>
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
                    value={selectedDivision?.name || ''}
                    onChange={(e) => setSelectedDivision({ ...selectedDivision, name: e.target.value })}
                />
            </Row>
            <Row>
                <label>Siglas:</label>
                <Form.Control
                    type="text"
                    placeholder=""
                    value={selectedDivision?.siglas || ''}
                    onChange={(e) => setSelectedDivision({ ...selectedDivision, siglas: e.target.value })}
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
              placeholder="Buscar Division"
              style={{ marginLeft: "10px", borderRadius: "5px", border: "1px solid #ccc"}}
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
