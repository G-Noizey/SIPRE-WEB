import React, { useState } from 'react';
import { Button, Container, Modal, Row, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTable, usePagination, useGlobalFilter } from 'react-table';

const ConsultaTrabajadores = () => {
  
  // Array de datos de ejemplo para los trabajadores
  const data = React.useMemo(
    () => [
      {
        nombre: 'Juan',
        usuario: 'juanito',
        division: 'División 1',
        apellidos: 'Pérez',
        telefono: '1234567890',
        correo: 'juanito@example.com',
        direccion: 'Calle 123',
        monto: 1000,
        estatus: 'Activo',
      },
      // Agrega más datos si es necesario
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'nombre',
      },
      {
        Header: 'Usuario',
        accessor: 'usuario',
      },
      {
        Header: 'División',
        accessor: 'division',
      },
      {
        Header: 'Acciones',
        Cell: () => (
          <Button variant="success" size="sm" onClick={handleEditShow}>
            <AiFillEdit />
          </Button>
        ),
      },
      {
        Header: 'Estado de cuenta',
        Cell: () => (
          <Button variant="success" size="sm">
            Generar estado de cuenta
          </Button>
        ),
      },
      {
        Header: 'Ver más',
        Cell: () => (
       <Button variant="success" onClick={handleMoreShow}>
            Ver más
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
      data,
      initialState: { pageSize: 10 }, 
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showMore, setShowMore] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClose = () => setShowEdit(false);
  const handleEditShow = () => setShowEdit(true);

  const handleMoreClose = () => setShowMore(false);
const handleMoreShow = () => setShowMore(true);

  return (
    <>
      <div className='container-fluid p-3 my-3'>
        <div className='row'>
          <div className='col-6'>
            <Button variant="success" onClick={handleShow}>Añadir Trabajador <FaPlus /></Button>
          </div>

          <Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Añadir trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <label>Nombre:</label>
        <Form.Control type="text" placeholder=" " />
      </Row>
      <Row>
        <label>Usuario:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>División:</label>
        <Form.Control as="select">
          <option>División 1</option>
          {/* Agregar más opciones según tus necesidades */}
        </Form.Control>
      </Row>
      <Row>
        <label>Contraseña:</label>
        <Form.Control type="password" placeholder="" />
      </Row>
      <Row>
        <label>Apellidos:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Teléfono:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Correo Electrónico:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Dirección:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Monto:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
    </Container>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleClose}>Crear</Button>
  </Modal.Footer>
</Modal>





<Modal show={showEdit} onHide={handleEditClose}>
  <Modal.Header closeButton>
    <Modal.Title>Modificar trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <label>Nombre:</label>
        <Form.Control type="text" placeholder=" " />
      </Row>
      <Row>
        <label>Usuario:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>División:</label>
        <Form.Control as="select">
          <option>División 1</option>
          {/* Agregar más opciones según tus necesidades */}
        </Form.Control>
      </Row>
      <Row>
        <label>Contraseña:</label>
        <Form.Control type="password" placeholder="" />
      </Row>
      <Row>
        <label>Apellidos:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Teléfono:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Correo Electrónico:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Dirección:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Monto:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
    </Container>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleEditClose}>Guardar cambios</Button>
  </Modal.Footer>
</Modal>
<Modal show={showEdit} onHide={handleEditClose}>
  <Modal.Header closeButton>
    <Modal.Title>Modificar trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <label>Nombre:</label>
        <Form.Control type="text" placeholder=" " />
      </Row>
      <Row>
        <label>Usuario:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>División:</label>
        <Form.Control as="select">
          <option>División 1</option>
          {/* Agregar más opciones según tus necesidades */}
        </Form.Control>
      </Row>
      <Row>
        <label>Contraseña:</label>
        <Form.Control type="password" placeholder="" />
      </Row>
      <Row>
        <label>Apellidos:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Teléfono:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Correo Electrónico:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Dirección:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
      <Row>
        <label>Monto:</label>
        <Form.Control type="text" placeholder="" />
      </Row>
    </Container>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleEditClose}>Guardar cambios</Button>
  </Modal.Footer>
</Modal>


<Modal show={showMore} onHide={handleMoreClose}>
  <Modal.Header closeButton>
    <Modal.Title>Detalles del Trabajador</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Container>
      <Row>
        <label>Nombre:</label>
        <span>For each</span>
      </Row>
      <Row>
        <label>Usuario:</label>
        <span>For each</span>
      </Row>
      <Row>
        <label>División:</label>
        <span>For each </span>
      </Row>
      <Row>
        <label>Apellidos:</label>
        <span>For each  </span>
      </Row>
      <Row>
        <label>Teléfono:</label>
        <span>For each   </span>
      </Row>
      <Row>
        <label>Correo Electrónico:</label>
        <span>For each   </span>
      </Row>
      <Row>
        <label>Dirección:</label>
        <span>For each   </span>
      </Row>
      <Row>
        <label>Monto:</label>
        <span></span>
      </Row>
    </Container>
  </Modal.Body>
 
</Modal>












          <div className='col-6 d-flex justify-content-end'>
            <p>Buscar trabajador:</p>
            <input
              type="text"
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Buscar..."
              style={{ marginLeft: '10px' }}
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
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
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

export default ConsultaTrabajadores;
