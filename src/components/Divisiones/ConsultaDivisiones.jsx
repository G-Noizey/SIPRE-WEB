import React, { useState } from 'react';
import { Button, Container, Modal, Row, Form } from 'react-bootstrap';
import { AiFillEdit } from "react-icons/ai";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTable, usePagination, useGlobalFilter } from 'react-table';

const ConsultaDivisiones = () => {
  
  // Arrego de datos estaticos mostrados en la tabla.
  const data = React.useMemo(
    () => [
      {
        division: 'División 1',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },
      {
        division: 'División 2',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },

      {
        division: 'División 3',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },
      {
        division: 'División 4',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },

      {
        division: 'División 5',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },
      {
        division: 'División 6',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },

      {
        division: 'División 7',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },
      {
        division: 'División 8',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },

      {
        division: 'División 9',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },
      {
        division: 'División 10',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },

      {
        division: 'División 11',
        sigla: 'D1',
        monto: 1000,
        estatus: 'Activo',
      },
      {
        division: 'División 12',
        sigla: 'D1',
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
        Header: 'División',
        accessor: 'division',
      },
      {
        Header: 'Sigla',
        accessor: 'sigla',
      },
      {
        Header: 'Monto',
        accessor: 'monto',
      },
      {
        Header: 'Estatus',
        accessor: 'estatus',
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClose = () => setShowEdit(false);
  const handleEditShow = () => setShowEdit(true);

  return (
    <>
      <div className='container-fluid p-3 my-3'>
        <div className='row'>
          <div className='col-6'>
            <Button variant="success" onClick={handleShow}>Añadir División <FaPlus /></Button>
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir división</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre de la división:</label>
                  <Form.Control type="text" placeholder=" " />
                </Row>
                <Row>
                  <label>Siglas:</label>
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
              <Modal.Title>Modificar división</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <label>Nombre de la división:</label>
                  <Form.Control type="text" placeholder=" " />
                </Row>
                <Row>
                  <label>Siglas:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Monto:</label>
                  <Form.Control type="text" placeholder="" />
                </Row>
                <Row>
                  <label>Estatus:</label>
                  <Form.Control as="select" defaultValue="Activo">
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </Form.Control>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleEditClose}>Guardar cambios</Button>
            </Modal.Footer>
          </Modal>

          <div className='col-6 d-flex justify-content-end'>
            <p>Buscar división:</p>
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

export default ConsultaDivisiones;
